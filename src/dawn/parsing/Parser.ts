import {TokenType} from "@dawn/parsing/Token";
import {ProgramExpression} from "@dawn/lang/ast/ProgramExpression";
import {Expression} from "@dawn/lang/ast/Expression";
import {TokenReader} from "@dawn/parsing/TokenReader";
import {BinaryExpression} from "@dawn/lang/ast/BinaryExpression";
import {UnaryExpression} from "@dawn/lang/ast/UnaryExpression";
import {LiteralExpression} from "@dawn/lang/ast/LiteralExpression";
import {GroupingExpression} from "@dawn/lang/ast/GroupingExpression";
import {ValueType} from "@dawn/lang/ast/Value";
import {EqualityExpression} from "@dawn/lang/ast/EqualityExpression";
import {ComparisonExpression} from "@dawn/lang/ast/ComparisonExpression";
import {Statement, StatementType} from "@dawn/lang/ast/Statement";
import {VariableDeclaration} from "@dawn/lang/ast/statements/VariableDeclaration";
import {VariableExpression} from "@dawn/lang/ast/VariableExpression";
import {ModuleDeclaration} from "@dawn/lang/ast/statements/ModuleDeclaration";

function parse(reader: TokenReader) {
  const programAst: ProgramExpression = { type: StatementType.PROGRAM, instructions: [] };
  const errors: string[] = [];

  function parseNext() {
    try {
      return declaration();
    } catch(error) {
      errors.push(error as string);
      recoverFromError();

      return null;
    }
  }

  function declaration(): Expression {
    if (reader.match(TokenType.VAL)) {
      return variableDeclaration();
    }

    if (reader.match(TokenType.MODULE)) {
      return moduleDeclaration();
    }

    return expression();
  }

  function variableDeclaration(): VariableDeclaration {
    const name = reader.consume(TokenType.IDENTIFIER, "Expected name for variable");
    reader.consume(TokenType.EQUALS, "Expected initializer for variable");
    const initializer = expression();

    return { type: StatementType.VARIABLE_DECLARATION, name, initializer };
  }

  function moduleDeclaration(): ModuleDeclaration {
    const name = reader.consume(TokenType.IDENTIFIER, "Expected name for module");
    reader.consume(TokenType.BRACKET_OPEN, `Expected body for module ${name.lexeme}`);
    const body = exportableStatement();
    reader.consume(TokenType.BRACKET_CLOSE, `Missing } for module ${name.lexeme}`);

    return { type: StatementType.MODULE_DECLARATION, name, body };
  }

  function exportableStatement(): Statement {

  }

  function expression(): Statement {
    return equality();
  }

  function equality(): Expression {
    let leftExpression: EqualityExpression |  Expression = comparison();

    while(reader.match(TokenType.EQUALS, TokenType.BANG_EQUALS)) {
      const equalityOperator = reader.previous();
      const rightExpression = comparison();
      leftExpression = { type: StatementType.EQUALITY, left: leftExpression, right: rightExpression, equalityOperator };
    }

    return leftExpression;
  }

  function comparison(): Expression {
    let leftExpression: ComparisonExpression | Expression = addition();

    while(reader.match(TokenType.GREATER_OR_EQUAL, TokenType.GREATER_THAN, TokenType.LESS_OR_EQUAL, TokenType.LESS_THAN)) {
      const comparisonOperator = reader.previous();
      const rightExpression = addition();
      leftExpression = { type: StatementType.COMPARISON, left: leftExpression, right: rightExpression, comparisonOperator };
    }

    return leftExpression;
  }

  function addition(): Expression {
    let expression: BinaryExpression | Expression  = multiplication();

    while(reader.match(TokenType.PLUS, TokenType.HYPHEN)) {
      const operator = reader.previous();
      const rightOperand = multiplication();

      expression = { type: StatementType.BINARY, left: expression, right: rightOperand, operator };
    }

    return expression;
  }

  function multiplication(): Expression | BinaryExpression {
    let expression: Expression | BinaryExpression = unary();

    while(reader.match(TokenType.STAR, TokenType.FORWARD_SLASH)) {
      const operator = reader.previous();
      const rightOperand = unary();

      expression = {type: StatementType.BINARY, left: expression, right: rightOperand, operator};
    }

    return expression;
  }

  function unary(): Expression {
    if (reader.match(TokenType.BANG, TokenType.HYPHEN)) {
      const operator = reader.previous();
      const rightOperand = unary();

      return { type: StatementType.UNARY, operand: rightOperand } as UnaryExpression;
    }

    return literal();
  }

  function literal(): Expression {
    if (reader.match(TokenType.INT_NUMBER)) {
      const int = reader.previous().value;
      return { type: StatementType.LITERAL, value: { type: ValueType.INT, value: int } } as LiteralExpression;
    }

    if (reader.match(TokenType.FLOAT_NUMBER)) {
      const float = reader.previous().value;
      return { type: StatementType.LITERAL, value: { type: ValueType.FLOAT, value: float } } as LiteralExpression;
    }

    if (reader.match(TokenType.IDENTIFIER)) {
      const identifier = reader.previous();
      return { type: StatementType.VARIABLE, name: identifier } as VariableExpression;
    }

    if (reader.consume(TokenType.PAREN_OPEN, "Expected expression")) {
      const expr = expression();
      const closingParenthesis = reader.consume(TokenType.PAREN_CLOSE, "Expected closing parenthesis");
      return { type: StatementType.GROUPING, expression: expr } as GroupingExpression;
    }

    throw new Error('Expected expression here');
  }

  function recoverFromError() {
    while(!reader.isAtEnd()) {
      const next = reader.peek();

      switch(next.type) {
        case TokenType.MODULE:
        case TokenType.VAL:
        case TokenType.RETURN:
          return;
      }

      reader.advance();
    }
  }

  return { ast: programAst, errors };
}
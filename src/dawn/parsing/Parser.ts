import {TokenType} from "@dawn/parsing/Token";
import {ProgramExpression} from "@dawn/lang/ast/ProgramExpression";
import {Expression, ExpressionType} from "@dawn/lang/ast/Expression";
import {TokenReader} from "@dawn/parsing/TokenReader";
import {BinaryExpression} from "@dawn/lang/ast/BinaryExpression";
import {UnaryExpression} from "@dawn/lang/ast/UnaryExpression";
import {LiteralExpression} from "@dawn/lang/ast/LiteralExpression";
import {GroupingExpression} from "@dawn/lang/ast/GroupingExpression";
import {ValueType} from "@dawn/lang/ast/Value";

function parse(reader: TokenReader) {
  const programAst: ProgramExpression = { type: ExpressionType.PROGRAM, instructions: [] };

  function expression(): Expression {

  }

  function addition() {
    let expression: Expression | BinaryExpression = multiplication();

    while(reader.match(TokenType.PLUS, TokenType.HYPHEN)) {
      const operator = reader.previous();
      const rightOperand = multiplication();

      expression = { type: ExpressionType.BINARY, left: expression, right: rightOperand, operator };
    }

    return expression;
  }

  function multiplication(): Expression | BinaryExpression {
    let expression: Expression | BinaryExpression = unary();

    while(reader.match(TokenType.STAR, TokenType.FORWARD_SLASH)) {
      const operator = reader.previous();
      const rightOperand = unary();

      expression = {type: ExpressionType.BINARY, left: expression, right: rightOperand, operator};
    }

    return expression;
  }

  function unary(): UnaryExpression | LiteralExpression {
    if (reader.match(TokenType.BANG, TokenType.HYPHEN)) {
      const operator = reader.previous();
      const rightOperand = unary();

      return { type: ExpressionType.UNARY, operand: rightOperand };
    }

    return literal();
  }

  function literal(): LiteralExpression | GroupingExpression {
    if (reader.match(TokenType.INT_NUMBER)) {
      const int = reader.previous().value;
      return { type: ExpressionType.LITERAL, value: { type: ValueType.INT, value: int } };
    }

    if (reader.match(TokenType.FLOAT_NUMBER)) {
      const float = reader.previous().value;
      return { type: ExpressionType.LITERAL, value: { type: ValueType.FLOAT, value: float } };
    }

    if (reader.match(TokenType.IDENTIFIER)) {
      const identifier = reader.previous();
      return { type: ExpressionType.LITERAL, value: { type: ValueType.IDENTIFIER, value: identifier.value } };
    }

    if (reader.consume(TokenType.PAREN_OPEN, "Expected expression")) {
      const expr = expression();
      const closingParenthesis = reader.consume(TokenType.PAREN_CLOSE, "Expected closing parenthesis");
      return { type: ExpressionType.GROUPING, expression: expr };
    }
  }

  return programAst;
}
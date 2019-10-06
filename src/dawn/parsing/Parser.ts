import {TokenReader} from "@dawn/parsing/TokenReader";
import {Token, TokenType} from "@dawn/parsing/Token";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {Expression} from "@dawn/lang/ast/Expression";
import {LiteralExpression} from "@dawn/lang/ast/Literal";
import {ValAccessor} from "@dawn/lang/ast/ValAccessor";
import {Invocation} from "@dawn/lang/ast/Invocation";
import {BinaryExpression, findBinaryExpressionOperator} from "@dawn/lang/ast/expressions/BinaryExpression";
import {ComparisonExpression, findComparisonOperator} from "@dawn/lang/ast/expressions/ComparisonExpression";
import {EqualityExpression, findEqualityOperator} from "@dawn/lang/ast/expressions/EqualityExpression";
import {Statement} from "@dawn/lang/ast/Statement";
import {Return} from "@dawn/lang/ast/Return";
import {FunctionDeclarationArgument} from "@dawn/lang/ast/FunctionDeclarationArgument";
import {FunctionDeclaration} from "@dawn/lang/ast/FunctionDeclaration";
import {ValDeclaration} from "@dawn/lang/ast/ValDeclaration";
import {Instantiation, KeyValue} from "@dawn/lang/ast/Instantiation";

function parse(reader: TokenReader) {

  function functionDeclaration(): FunctionDeclaration {
    const name = reader.consume(TokenType.IDENTIFIER, "Expected function name");
    const args: FunctionDeclarationArgument[] = [];

    reader.consume(TokenType.PAREN_OPEN, "Expected function prototype");
    while(reader.peek().type !== TokenType.PAREN_CLOSE) {
      args.push(functionArgument());
      reader.consume(TokenType.COMMA, "Expected comma after argument");
    }

    reader.consume(TokenType.PAREN_CLOSE, "Expected end of function arguments");

    let returnType = null;
    if (reader.peek().type === TokenType.IDENTIFIER) {
      returnType = reader.advance().value;
    }

    const body = functionBody();

    return {
      type: AstNodeType.FUNCTION_DECLARATION,
      reference: name,
      args,
      name: name.value,
      returnType,
      body,
    };
  }

  function functionArgument(): FunctionDeclarationArgument {
    const variableName = reader.consume(TokenType.IDENTIFIER, "Expected argument name");
    reader.consume(TokenType.COLON, "Expected colon after argument name");
    const variableType = reader.consume(TokenType.IDENTIFIER, "Expected argument type");

    return {
      type: AstNodeType.FUNCTION_DECLARATION_ARGUMENT,
      reference: variableName,
      valueName: variableName.value,
      valueType: variableType.value,
    };
  }

  function functionBody(): Statement[]  {
    reader.consume(TokenType.BRACKET_OPEN, "Expected function body");
    const body = [];

    while(reader.peek().type !== TokenType.BRACKET_CLOSE) {
      const stmt = statement();
      body.push(stmt);
    }

    reader.consume(TokenType.BRACKET_CLOSE, "Expected end of function body");

    return body;
  }

  function statement(): Statement {
    if (reader.peek().type === TokenType.RETURN) {
      return returnStatement();
    }

    if (reader.peek().type === TokenType.VAL) {
      return valDeclaration();
    }

    return expression();
  }

  function returnStatement(): Return {
    const reference = reader.consume(TokenType.RETURN, "Expected return statement");
    const value = expression();

    return { type: AstNodeType.RETURN, reference, value };
  }

  function valDeclaration(): ValDeclaration {
    const reference = reader.consume(TokenType.VAL, "Expected value declaration");
    const name = reader.consume(TokenType.IDENTIFIER, "Expected value name");
    reader.consume(TokenType.EQUALS, "Expected assignment to value");
    const initializer = expression();

    return { type: AstNodeType.VAL_DECLARATION, reference, name: name.value, initializer };
  }

  function expression(): Expression {
    return equality();
  }

  function equality(): Expression {
    let left = comparison();

    while(reader.match(TokenType.BANG_EQUALS, TokenType.EQUALS_EQUALS)) {
      const equalityToken = reader.previous();
      const operator = findEqualityOperator(equalityToken);
      const right = comparison();

      left = {
        type: AstNodeType.EQUALITY,
        left, right,
        operator: {
          type: operator,
          reference: equalityToken,
        },
      } as EqualityExpression;
    }

    return left;
  }

  function comparison(): Expression {
    let left = addition();

    while(reader.match(TokenType.LESS_OR_EQUAL, TokenType.LESS_THAN, TokenType.GREATER_OR_EQUAL, TokenType.GREATER_THAN)) {
      const operatorToken = reader.previous();
      const operator = findComparisonOperator(operatorToken);
      const right = addition();

      left = {
        type: AstNodeType.COMPARISON,
        left, right,
        reference: left.reference,
        operator: {
          type: operator,
          reference: operatorToken,
        },
      } as ComparisonExpression;
    }

    return left;
  }

  function addition(): Expression {
    let left = multiplication();

    while(reader.match(TokenType.PLUS, TokenType.COLON)) {
      const operatorToken = reader.previous();
      const operator = findBinaryExpressionOperator(operatorToken);
      const right = multiplication();

      left = {
        type: AstNodeType.BINARY,
        left, right,
        reference: left.reference,
        operator: { type: operator, reference: operatorToken },
      } as BinaryExpression;
    }

    return left;
  }

  function multiplication(): Expression {
    let left = unary();

    while(reader.match(TokenType.FORWARD_SLASH, TokenType.STAR)) {
      const operatorToken = reader.previous();
      const operator = findBinaryExpressionOperator(operatorToken);
      const right = unary();

      left = {
        type: AstNodeType.BINARY,
        left, right,
        reference: left.reference,
        operator: { type: operator, reference: operatorToken }
      } as BinaryExpression;
    }

    return left;
  }

  function unary(): Expression {
    if (reader.match(TokenType.BANG, TokenType.COLON)) {
      const operator = reader.previous();
      const right = unary();

      return { type: AstNodeType.UNARY, right, reference: operator, operator: operator.value };
    }

    return literal();
  }

  function literal(): Expression {
    if (reader.match(TokenType.PAREN_OPEN)) {
      const groupedExpression = expression();
      reader.consume(TokenType.PAREN_CLOSE, "Expected closing parenthesis");

      return groupedExpression;
    }

    if (reader.match(TokenType.IDENTIFIER)) {
      return undefinedLiteral();
    }

    if (reader.match(TokenType.INT_NUMBER, TokenType.FLOAT_NUMBER)) {
      const token = reader.previous();
      return { type: AstNodeType.LITERAL, value: token.value, reference: token } as LiteralExpression;
    }

    throw new Error("No match found for literal");
  }

  function undefinedLiteral(): ValAccessor | ObjectInstantiation {
    const acc = accessor();

    if (reader.peek().value === TokenType.BRACKET_OPEN) {
      return instantiation(acc);
    }

    return valaccessor(acc);
  }

  function instantiation(objectType: Accessor): Instantiation {
    const reference = reader.consume(TokenType.BRACKET_OPEN, "Expected object instantiation");

    let values: Expression[] | KeyValue[] = [];
    if (reader.peek().type !== TokenType.BRACKET_CLOSE) {
      if(reader.peekAt(2).type === TokenType.COLON) {
        values = keyValueInstantiation();
      } else {
        values = orderedInstantiation();
      }
    }

    reader.consume(TokenType.BRACKET_CLOSE, "Expected end of object instantiation");

    return { type: AstNodeType.INSTANTIATION, reference, objectType, values };
  }

  function keyValueInstantiation(): KeyValue[] {
    const values: KeyValue[] = [];

    let isFirstValue = true;
    while(reader.peek().type !== TokenType.BRACKET_CLOSE) {
      if (!isFirstValue) {
        reader.consume(TokenType.COMMA, "Expected comma for next value in instantiation");
      }
      isFirstValue = false;

      const key = reader.consume(TokenType.IDENTIFIER, "Expected key for key value instantiation");
      reader.consume(TokenType.COLON, "Expected assignment for key value instantiation");
      const value = expression();

      values.push({ key: key.value, value });
    }

    return values;
  }

  function orderedInstantiation(): Expression[] {
    const values: Expression[] = [];

    let isFirstValue = false;
    while (reader.peek().type !== TokenType.BRACKET_CLOSE) {
      if(!isFirstValue) {
        reader.consume(TokenType.COMMA, "Expected comma for next value in instantiation");
      }
      isFirstValue = false;

      const value = expression();

      values.push(value);
    }

    return values;
  }

  function valaccessor(value: Accessor): ValAccessor | ObjectInstantiation {
    if (reader.peek().value === TokenType.PAREN_OPEN) {
      const invoc = invocation();
      reader.consume(TokenType.PAREN_CLOSE, "Expected closing parenthesis");

      return {
        type: AstNodeType.VALACCESSOR,
        invocation: invoc,
        reference: value.reference,
        value,
      };
    }

    return { type: AstNodeType.VALACCESSOR, reference: value.reference, value };
  }

  function invocation(): Invocation {
    const leftParen = reader.consume(TokenType.PAREN_OPEN, "Expected invocation");
    const args: Expression[] = [];

    let isFirstArgument = false;
    while(reader.peek().type != TokenType.PAREN_CLOSE) {
      if (!isFirstArgument) {
        reader.consume(TokenType.COMMA, "Expected comma after argument");
      }
      isFirstArgument = false;

      const expr = expression();
      args.push(expr);
    }

    reader.consume(TokenType.PAREN_CLOSE, "Expected closing parenthesis");

    return { type: AstNodeType.INVOCATION, reference: leftParen, arguments: args };
  }

  function accessor(): Accessor {
    const name = reader.consume(TokenType.IDENTIFIER, "Expected identifier for accessor");

    if (reader.peek().type === TokenType.DOT) {
      reader.advance();
      const subAccessor = accessor();

      return { type: AstNodeType.ACCESSOR, reference: name, name: name.value, subAccessor };
    }

    return { type: AstNodeType.ACCESSOR, reference: name, name: name.value };
  }

}
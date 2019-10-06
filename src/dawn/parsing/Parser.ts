import {TokenReader} from "@dawn/parsing/TokenReader";
import {TokenType} from "@dawn/parsing/Token";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {StatementType} from "@dawn/lang/ast/Statement";
import {Expression} from "@dawn/lang/ast/Expression";
import {LiteralExpression} from "@dawn/lang/ast/Literal";
import {ValAccessor} from "@dawn/lang/ast/ValAccessor";
import {Invocation} from "@dawn/lang/ast/Invocation";
import {BinaryExpression, findBinaryExpressionOperator} from "@dawn/lang/ast/BinaryExpression";

function parse(reader: TokenReader) {

  function expression(): Expression {

  }

  function multiplication(): Expression {
    let left = unary();

    while(reader.match(TokenType.FORWARD_SLASH, TokenType.STAR)) {
      const operatorToken = reader.previous();
      const operator = findBinaryExpressionOperator(operatorToken);
      const right = unary();

      left = {
        type: StatementType.BINARY,
        left, right,
        reference: left.reference,
        operator: { type: operator, reference: operatorToken }
      } as BinaryExpression;
    }
  }

  function unary(): Expression {
    if (reader.match(TokenType.BANG, TokenType.COLON)) {
      const operator = reader.previous();
      const right = unary();

      return { type: StatementType.UNARY, right, reference: operator, operator: operator.value };
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
      return valaccessor();
    }

    if (reader.match(TokenType.INT_NUMBER, TokenType.FLOAT_NUMBER)) {
      const token = reader.previous();
      return { type: StatementType.LITERAL, value: token.value, reference: token } as LiteralExpression;
    }

    throw new Error("No match found for literal");
  }

  function valaccessor(): ValAccessor {
    const acc = accessor();

    if (reader.peek().value === TokenType.PAREN_OPEN) {
      const invoc = invocation();
      reader.consume(TokenType.PAREN_CLOSE, "Expected closing parenthesis");

      return { type: StatementType.VALACCESSOR, invocation: invoc, reference: acc.reference, value: acc };
    }

    return { type: StatementType.VALACCESSOR, reference: acc.reference, value: acc };
  }

  function invocation(): Invocation {
    reader.consume(TokenType.PAREN_OPEN, "Expected invocation");
    const args = [];

    // while(reader.peek().type != TokenType.PAREN_CLOSE) {
    //   const expr = expression();
    //
    // }
  }

  function accessor(): Accessor {
    const name = reader.consume(TokenType.IDENTIFIER, "Expected identifier for accessor");

    if (reader.peek().type === TokenType.DOT) {
      reader.advance();
      const subAccessor = accessor();

      return { type: StatementType.ACCESSOR, reference: name, name: name.value, subAccessor };
    }

    return { type: StatementType.ACCESSOR, reference: name, name: name.value };
  }

}
import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {Expression, ExpressionNode} from "@dawn/lang/ast/Expression";
import {Token, TokenType} from "@dawn/parsing/Token";

export enum BinaryOperator {
  ADD,
  SUBTRACT,
  MULTIPLY,
  DIVIDE
}

export function findBinaryExpressionOperator(token: Token) {
  switch(token.type) {
    case TokenType.STAR:
      return BinaryOperator.MULTIPLY;
    case TokenType.FORWARD_SLASH:
      return BinaryOperator.DIVIDE;
    case TokenType.PLUS:
      return BinaryOperator.ADD;
    case TokenType.COLON:
      return BinaryOperator.SUBTRACT;
  }

  throw new Error(`Operator ${token.lexeme} is not available for binary expressions`);
}

export interface BinaryExpression extends ExpressionNode {
  type: AstNodeType.BINARY;
  left: Expression;
  operator: BinaryOperator;
  right: Expression;
}

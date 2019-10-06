import {AstNode, AstNodeType} from "@dawn/lang/ast/AstNode";
import {Expression} from "@dawn/lang/ast/Expression";
import {Token, TokenType} from "@dawn/parsing/Token";

export enum BinaryExpressionOperator {
  ADD,
  SUBTRACT,
  MULTIPLY,
  DIVIDE
}

export function findBinaryExpressionOperator(token: Token) {
  switch(token.type) {
    case TokenType.STAR:
      return BinaryExpressionOperator.MULTIPLY;
    case TokenType.FORWARD_SLASH:
      return BinaryExpressionOperator.DIVIDE;
    case TokenType.PLUS:
      return BinaryExpressionOperator.ADD;
    case TokenType.COLON:
      return BinaryExpressionOperator.SUBTRACT;
  }

  throw new Error(`Operator ${token.lexeme} is not available for binary expressions`);
}

export interface BinaryExpression extends AstNode {
  type: AstNodeType.BINARY;
  left: Expression;
  operator: {
    type: BinaryExpressionOperator;
    reference: Token;
  };
  right: Expression;
}
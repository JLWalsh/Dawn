import {AstNode, AstNodeType} from "@dawn/lang/ast/AstNode";
import {Expression} from "@dawn/lang/ast/Expression";
import {Token, TokenType} from "@dawn/parsing/Token";

export enum EqualityOperator {
  NOT_EQUAL,
  EQUALS
}

export function findEqualityOperator(operatorToken: Token) {
  switch(operatorToken.type) {
    case TokenType.BANG_EQUALS:
      return EqualityOperator.NOT_EQUAL;
    case TokenType.EQUALS:
      return EqualityOperator.EQUALS;
  }

  throw new Error(`Operator ${operatorToken.lexeme} is not available for equality expressions`);
}

export interface EqualityExpression extends AstNode {
  type: AstNodeType.EQUALITY;
  left: Expression;
  operator: {
    type: EqualityOperator;
    reference: Token;
  };
  right: Expression;
}
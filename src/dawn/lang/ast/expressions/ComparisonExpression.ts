import {Expression, ExpressionNode} from "@dawn/lang/ast/Expression";
import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {Token, TokenType} from "@dawn/parsing/Token";

export enum ComparisonOperator {
  GREATER_THAN,
  GREATER_EQUAL_THAN,
  LESSER_THAN,
  LESSER_EQUAL_THAN,
}

export function findComparisonOperator(operatorToken: Token): ComparisonOperator {
  switch(operatorToken.type) {
    case TokenType.GREATER_THAN:
      return ComparisonOperator.GREATER_THAN;
    case TokenType.GREATER_OR_EQUAL:
      return ComparisonOperator.GREATER_EQUAL_THAN;
    case TokenType.LESS_THAN:
      return ComparisonOperator.LESSER_THAN;
    case TokenType.LESS_OR_EQUAL:
      return ComparisonOperator.LESSER_EQUAL_THAN;
  }

  throw new Error(`Operator ${operatorToken.lexeme} is not available for comparison expressions`);
}

export interface ComparisonExpression extends ExpressionNode {
  type: AstNodeType.COMPARISON;
  left: Expression;
  operator: ComparisonOperator;
  right: Expression;
}

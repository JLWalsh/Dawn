import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {Expression, ExpressionNode} from "@dawn/lang/ast/Expression";

export enum UnaryOperator {
  NOT = "!",
  MINUS = "-",
}

export interface UnaryExpression extends ExpressionNode {
  type: AstNodeType.UNARY;
  operator: UnaryOperator;
  right: Expression;
}

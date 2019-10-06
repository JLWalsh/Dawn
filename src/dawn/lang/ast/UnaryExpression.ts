import {Expression, ExpressionType} from "@dawn/lang/ast/Expression";

export interface UnaryExpression extends Expression {
  type: ExpressionType.UNARY
  operand: Expression
}
import {Expression, ExpressionType} from "@dawn/lang/ast/Expression";

export interface GroupingExpression extends Expression {
  type: ExpressionType.GROUPING
  expression: Expression
}
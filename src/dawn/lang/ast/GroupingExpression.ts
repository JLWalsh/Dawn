import {Expression, StatementType} from "@dawn/lang/ast/Expression";

export interface GroupingExpression extends Expression {
  type: StatementType.GROUPING
  expression: Expression
}
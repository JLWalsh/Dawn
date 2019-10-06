import {Expression, StatementType} from "@dawn/lang/ast/Expression";

export interface UnaryExpression extends Expression {
  type: StatementType.UNARY
  operand: Expression
}
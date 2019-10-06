import {Statement, StatementType} from "@dawn/lang/ast/Statement";
import {Expression} from "@dawn/lang/ast/Expression";

export enum UnaryOperator {
  NOT = "!",
  MINUS = "-",
}

export interface UnaryExpression extends Statement {
  type: StatementType.UNARY;
  operator: UnaryOperator;
  right: Expression;
}
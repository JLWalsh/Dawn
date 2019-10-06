import {Statement, StatementType} from "@dawn/lang/ast/Statement";
import {Expression} from "@dawn/lang/ast/Expression";

export interface Invocation extends Statement {
  type: StatementType.INVOCATION;
  arguments: Expression;
}
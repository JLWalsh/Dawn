import {Statement, StatementType} from "@dawn/lang/ast/Statement";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {Invocation} from "@dawn/lang/ast/Invocation";

export interface ValAccessor extends Statement {
  type: StatementType.VALACCESSOR;
  value: Accessor;
  invocation?: Invocation;
}
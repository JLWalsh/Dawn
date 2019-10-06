import {Statement, StatementType} from "@dawn/lang/ast/Statement";

export interface Accessor extends Statement {
  type: StatementType.ACCESSOR,
  name: string;
  subAccessor?: Accessor;
}
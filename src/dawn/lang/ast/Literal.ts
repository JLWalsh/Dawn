import {Statement, StatementType} from "@dawn/lang/ast/Statement";
import {NativeType} from "@dawn/lang/NativeType";

export interface LiteralExpression extends Statement {
  type: StatementType.LITERAL;
  value: any;
  valueType: NativeType;
}
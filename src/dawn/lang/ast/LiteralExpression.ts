import {Expression, StatementType} from "@dawn/lang/ast/Expression";
import {Value} from "@dawn/lang/ast/Value";

export interface LiteralExpression extends Expression {
  type: StatementType.LITERAL,
  value: Value,
}
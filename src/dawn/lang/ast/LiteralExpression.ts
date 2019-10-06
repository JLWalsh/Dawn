import {Expression, ExpressionType} from "@dawn/lang/ast/Expression";
import {Value} from "@dawn/lang/ast/Value";

export interface LiteralExpression extends Expression {
  type: ExpressionType.LITERAL,
  value: Value,
}
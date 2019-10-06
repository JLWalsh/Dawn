import {Statement, StatementType} from "@dawn/lang/ast/Statement";
import {UnaryExpression} from "@dawn/lang/ast/UnaryExpression";
import {ValAccessor} from "@dawn/lang/ast/ValAccessor";
import {LiteralExpression} from "@dawn/lang/ast/Literal";
import {BinaryExpression} from "@dawn/lang/ast/BinaryExpression";

export type Expression =
  | EqualityExpression
  | UnaryExpression
  | ValAccessor
  | LiteralExpression
  | BinaryExpression;

export interface EqualityExpression extends Statement {
  type: StatementType.EQUALITY,

}
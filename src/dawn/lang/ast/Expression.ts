import {UnaryExpression} from "@dawn/lang/ast/expressions/UnaryExpression";
import {ValAccessor} from "@dawn/lang/ast/ValAccessor";
import {LiteralExpression} from "@dawn/lang/ast/Literal";
import {BinaryExpression} from "@dawn/lang/ast/expressions/BinaryExpression";
import {ComparisonExpression} from "@dawn/lang/ast/expressions/ComparisonExpression";
import {EqualityExpression} from "@dawn/lang/ast/expressions/EqualityExpression";
import {Instantiation} from "@dawn/lang/ast/Instantiation";

export type Expression =
  | EqualityExpression
  | UnaryExpression
  | ValAccessor
  | LiteralExpression
  | BinaryExpression
  | ComparisonExpression
  | Instantiation;

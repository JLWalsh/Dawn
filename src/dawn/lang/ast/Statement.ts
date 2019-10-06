import {Expression} from "@dawn/lang/ast/Expression";
import {Return} from "@dawn/lang/ast/Return";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";

export type Statement =
  | Expression
  | Return
  | ValDeclaration;
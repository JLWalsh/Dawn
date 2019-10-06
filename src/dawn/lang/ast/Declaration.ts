import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";
import {ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {ObjectDeclaration} from "@dawn/lang/ast/declarations/ObjectDeclaration";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";

export type Declaration =
  | FunctionDeclaration
  | ModuleDeclaration
  | ObjectDeclaration
  | ValDeclaration;
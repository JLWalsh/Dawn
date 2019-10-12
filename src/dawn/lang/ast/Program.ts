import {ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {ObjectDeclaration} from "@dawn/lang/ast/declarations/ObjectDeclaration";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";
import {Import} from "@dawn/lang/ast/Import";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";

export type ProgramContent =
  | ModuleDeclaration
  | ObjectDeclaration
  | FunctionDeclaration
  | Import
  | ValDeclaration;

export interface Program {
  body: ProgramContent[];
}

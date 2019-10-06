import {ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {ObjectDeclaration} from "@dawn/lang/ast/declarations/ObjectDeclaration";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";
import {Import} from "@dawn/lang/ast/Import";

export type ProgramContent =
  | ModuleDeclaration
  | ObjectDeclaration
  | FunctionDeclaration
  | Import;

export interface Program {
  body: ProgramContent[];
}
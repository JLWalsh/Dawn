import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";
import {ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {ObjectDeclaration} from "@dawn/lang/ast/declarations/ObjectDeclaration";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";
import {Import} from "@dawn/lang/ast/Import";
import {Export} from "@dawn/lang/ast/Export";
import {AstNode} from "@dawn/lang/ast/AstNode";
import {ProgramContent} from "@dawn/lang/ast/Program";

export interface DeclarationNode extends AstNode {
  acceptDeclarationVisitor<T>(declarationVisitor: DeclarationVisitor<T>): T;
}

export type Declaration =
  | ObjectDeclaration
  | ModuleDeclaration
  | FunctionDeclaration
  | ValDeclaration;

export type NamedDeclaration = Declaration & {
  name: string;
}

export function isNamedDeclaration(programContent: ProgramContent): programContent is NamedDeclaration {
  return 'name' in programContent;
}

export interface DeclarationVisitor<T> {
  visitFunctionDeclaration(f: FunctionDeclaration): T;
  visitModuleDeclaration(m: ModuleDeclaration): T;
  visitObjectDeclaration(o: ObjectDeclaration): T;
  visitValDeclaration(v: ValDeclaration): T;
  visitImport(i: Import): T;
  visitExport(e: Export): T;
}

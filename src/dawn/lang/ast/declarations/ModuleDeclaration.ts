import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {Declaration, DeclarationNode} from "@dawn/lang/ast/DeclarationNode";
import {Export} from "@dawn/lang/ast/Export";

export type ModuleContent = Declaration | Export;

export interface ModuleDeclaration extends DeclarationNode {
  type: AstNodeType.MODULE_DECLARATION;
  name: string;
  body: ModuleContent[];
}

import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {DeclarationNode} from "@dawn/lang/ast/DeclarationNode";

export interface Import extends DeclarationNode {
  type: AstNodeType.IMPORT;
  importedModule: Accessor;
}

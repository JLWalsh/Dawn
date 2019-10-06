import {AstNode, AstNodeType} from "@dawn/lang/ast/AstNode";
import {Accessor} from "@dawn/lang/ast/Accessor";

export interface Import extends AstNode {
  type: AstNodeType.IMPORT;
  importedModule: Accessor;
}
import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {DeclarationNode, NamedDeclaration} from "@dawn/lang/ast/DeclarationNode";

export interface Export extends DeclarationNode {
  type: AstNodeType.EXPORT;
  exported: NamedDeclaration;
}

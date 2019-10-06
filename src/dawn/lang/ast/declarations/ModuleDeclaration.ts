import {AstNode, AstNodeType} from "@dawn/lang/ast/AstNode";
import {Declaration} from "@dawn/lang/ast/Declaration";
import {Export} from "@dawn/lang/ast/Export";

export interface ModuleDeclaration extends AstNode {
  type: AstNodeType.MODULE_DECLARATION;
  name: string;
  body: (Export | Declaration)[];
}
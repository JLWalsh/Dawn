import {AstNode, AstNodeType} from "@dawn/lang/ast/AstNode";
import {Declaration} from "@dawn/lang/ast/Declaration";

export interface Export extends AstNode {
  type: AstNodeType.EXPORT;
  exported: Declaration;
}
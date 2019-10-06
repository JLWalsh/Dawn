import {AstNode, AstNodeType} from "@dawn/lang/ast/AstNode";
import {Expression} from "@dawn/lang/ast/Expression";

export interface ValDeclaration extends AstNode {
  type: AstNodeType.VAL_DECLARATION;
  name: string;
  initializer: Expression;
}
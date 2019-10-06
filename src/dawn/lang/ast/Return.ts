import {AstNode, AstNodeType} from "@dawn/lang/ast/AstNode";
import {Expression} from "@dawn/lang/ast/Expression";

export interface Return extends AstNode{
  type: AstNodeType.RETURN;
  value: Expression;
}
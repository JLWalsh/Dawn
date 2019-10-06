import {AstNode, AstNodeType} from "@dawn/lang/ast/AstNode";
import {Expression} from "@dawn/lang/ast/Expression";

export interface Invocation extends AstNode {
  type: AstNodeType.INVOCATION;
  arguments: Expression[];
}
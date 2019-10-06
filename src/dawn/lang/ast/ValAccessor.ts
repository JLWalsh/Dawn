import {AstNode, AstNodeType} from "@dawn/lang/ast/AstNode";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {Invocation} from "@dawn/lang/ast/Invocation";

export interface ValAccessor extends AstNode {
  type: AstNodeType.VALACCESSOR;
  value: Accessor;
  invocation?: Invocation;
}
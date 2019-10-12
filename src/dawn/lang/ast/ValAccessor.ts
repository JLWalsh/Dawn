import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {Invocation} from "@dawn/lang/ast/Invocation";
import {ExpressionNode} from "@dawn/lang/ast/Expression";

export interface ValAccessor extends ExpressionNode {
  type: AstNodeType.VALACCESSOR;
  value: Accessor;
  invocation?: Invocation;
}

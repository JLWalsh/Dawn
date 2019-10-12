import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {NativeType} from "@dawn/lang/NativeType";
import {ExpressionNode} from "@dawn/lang/ast/Expression";

export interface Literal extends ExpressionNode {
  type: AstNodeType.LITERAL;
  value: any;
  valueType: NativeType;
}

import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {PrimitiveType} from "@dawn/lang/PrimitiveType";
import {ExpressionNode} from "@dawn/lang/ast/Expression";

export interface Literal extends ExpressionNode {
  type: AstNodeType.LITERAL;
  value: any;
  valueType: PrimitiveType;
}

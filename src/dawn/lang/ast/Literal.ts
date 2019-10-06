import {AstNode, AstNodeType} from "@dawn/lang/ast/AstNode";
import {NativeType} from "@dawn/lang/NativeType";

export interface LiteralExpression extends AstNode {
  type: AstNodeType.LITERAL;
  value: any;
  valueType: NativeType;
}
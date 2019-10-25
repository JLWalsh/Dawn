import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {Expression, ExpressionNode} from "@dawn/lang/ast/Expression";

export interface Instantiation extends ExpressionNode {
  type: AstNodeType.INSTANTIATION;
  objectType: Accessor;
  values: KeyValue[] | Expression[]; // Either a key value instantiation or an ordered instantiation
}

export interface KeyValue {
  key: string;
  value: Expression;
}


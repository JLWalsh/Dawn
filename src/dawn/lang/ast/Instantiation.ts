import {AstNode, AstNodeType} from "@dawn/lang/ast/AstNode";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {Expression} from "@dawn/lang/ast/Expression";

export interface Instantiation extends AstNode {
  type: AstNodeType.INSTANTIATION;
  objectType: Accessor;
  values: KeyValue[] | Expression[]; // Either a key value instantiation or an ordered instantiation
}

export interface KeyValue {
  key: string;
  value: Expression;
}


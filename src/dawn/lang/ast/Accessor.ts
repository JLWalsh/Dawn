import {AstNode, AstNodeType} from "@dawn/lang/ast/AstNode";

export interface Accessor extends AstNode {
  type: AstNodeType.ACCESSOR,
  name: string;
  subAccessor?: Accessor;
}
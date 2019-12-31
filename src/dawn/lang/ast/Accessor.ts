import {AstNode, AstNodeType} from "@dawn/lang/ast/AstNode";

export interface Accessor extends AstNode {
  type: AstNodeType.ACCESSOR,
  name: string;
  subAccessor?: Accessor;
}

export function describeAccessor(accessor: Accessor): string {
  let string = accessor.name;

  let currentAccessor = accessor.subAccessor;
  while(currentAccessor) {
    string += currentAccessor.name;
    currentAccessor = accessor.subAccessor;
  }

  return string;
}

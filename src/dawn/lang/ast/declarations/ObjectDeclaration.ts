import {AstNode, AstNodeType} from "@dawn/lang/ast/AstNode";

export interface ObjectValue {
  name: string;
  valueType: string;
}

export interface ObjectDeclaration extends AstNode {
  type: AstNodeType.OBJECT_DECLARATION;
  name: string;
  values: ObjectValue[];
}
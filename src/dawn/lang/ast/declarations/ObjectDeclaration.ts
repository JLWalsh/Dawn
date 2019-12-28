import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {DeclarationNode} from "@dawn/lang/ast/DeclarationNode";
import {Accessor} from "@dawn/lang/ast/Accessor";

export interface ObjectValue {
  name: string;
  type: Accessor;
}

export interface ObjectDeclaration extends DeclarationNode {
  type: AstNodeType.OBJECT_DECLARATION;
  name: string;
  values: ObjectValue[];
}

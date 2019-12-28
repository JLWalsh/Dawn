import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {DeclarationNode} from "@dawn/lang/ast/DeclarationNode";

export interface ObjectValue {
  name: string;
  // TODO Change this to an accessor
  type: string;
}

export interface ObjectDeclaration extends DeclarationNode {
  type: AstNodeType.OBJECT_DECLARATION;
  name: string;
  values: ObjectValue[];
}

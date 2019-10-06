import {AstNode, AstNodeType} from "@dawn/lang/ast/AstNode";

export interface FunctionDeclarationArgument extends AstNode {
  type: AstNodeType.FUNCTION_DECLARATION_ARGUMENT;
  valueName: string;
  valueType: string;
}
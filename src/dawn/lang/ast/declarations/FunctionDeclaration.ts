import {AstNode, AstNodeType} from "@dawn/lang/ast/AstNode";
import {Statement} from "@dawn/lang/ast/Statement";
import {FunctionDeclarationArgument} from "@dawn/lang/ast/declarations/FunctionDeclarationArgument";

export interface FunctionDeclaration extends AstNode {
  type: AstNodeType.FUNCTION_DECLARATION;
  name: string;
  args: FunctionDeclarationArgument[];
  returnType: string | null;
  body: Statement[];
}
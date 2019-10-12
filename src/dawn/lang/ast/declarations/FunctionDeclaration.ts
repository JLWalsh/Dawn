import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {Statement} from "@dawn/lang/ast/Statement";
import {FunctionDeclarationArgument} from "@dawn/lang/ast/declarations/FunctionDeclarationArgument";
import {DeclarationNode} from "@dawn/lang/ast/DeclarationNode";

export interface FunctionDeclaration extends DeclarationNode {
  type: AstNodeType.FUNCTION_DECLARATION;
  name: string;
  args: FunctionDeclarationArgument[];
  returnType: string | null;
  body: Statement[];
}

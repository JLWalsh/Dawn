import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {Statement} from "@dawn/lang/ast/Statement";
import {FunctionArgument} from "@dawn/lang/ast/declarations/FunctionArgument";
import {DeclarationNode} from "@dawn/lang/ast/DeclarationNode";

export interface FunctionDeclaration extends DeclarationNode {
  type: AstNodeType.FUNCTION_DECLARATION;
  name: string;
  args: FunctionArgument[];
  returnType: string | null;
  body: Statement[];
}

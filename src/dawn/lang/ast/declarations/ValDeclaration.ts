import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {Expression} from "@dawn/lang/ast/Expression";
import {StatementNode} from "@dawn/lang/ast/Statement";
import {DeclarationNode} from "@dawn/lang/ast/DeclarationNode";

export interface ValDeclaration extends StatementNode, DeclarationNode {
  type: AstNodeType.VAL_DECLARATION;
  name: string;
  initializer: Expression;
}


import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {Expression} from "@dawn/lang/ast/Expression";
import {StatementNode} from "@dawn/lang/ast/Statement";

export interface Return extends StatementNode {
  type: AstNodeType.RETURN;
  value: Expression;
}

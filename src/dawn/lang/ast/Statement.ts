import {Expression} from "@dawn/lang/ast/Expression";
import {Return} from "@dawn/lang/ast/Return";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";
import {AstNode} from "@dawn/lang/ast/AstNode";

export interface StatementNode extends AstNode {
  acceptStatementVisitor<T>(visitor: StatementVisitor<T>): T;
}

export type Statement =
  | Expression
  | Return
  | ValDeclaration;

export interface StatementVisitor<T> {
  visitExpressionStatement(e: Expression): T;
  visitReturn(r: Return): T;
  visitValDeclaration(v: ValDeclaration): T;
}

import {AstNode, AstNodeType} from "@dawn/lang/ast/AstNode";
import {Expression} from "@dawn/lang/ast/Expression";

export enum UnaryOperator {
  NOT = "!",
  MINUS = "-",
}

export interface UnaryExpression extends AstNode {
  type: AstNodeType.UNARY;
  operator: UnaryOperator;
  right: Expression;
}
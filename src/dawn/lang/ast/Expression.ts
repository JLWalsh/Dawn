import {UnaryExpression} from "@dawn/lang/ast/expressions/UnaryExpression";
import {ValAccessor} from "@dawn/lang/ast/ValAccessor";
import {Literal} from "@dawn/lang/ast/Literal";
import {BinaryExpression} from "@dawn/lang/ast/expressions/BinaryExpression";
import {ComparisonExpression} from "@dawn/lang/ast/expressions/ComparisonExpression";
import {EqualityExpression} from "@dawn/lang/ast/expressions/EqualityExpression";
import {Instantiation} from "@dawn/lang/ast/Instantiation";

export interface ExpressionNode {
  acceptExpressionVisitor<T>(expressionVisitor: ExpressionVisitor<T>): T;
}

export type Expression =
  | EqualityExpression
  | UnaryExpression
  | ValAccessor
  | Literal
  | BinaryExpression
  | ComparisonExpression
  | Instantiation;

export interface ExpressionVisitor<T> {
  visitEquality(e: EqualityExpression): T;
  visitUnary(u: UnaryExpression): T;
  visitValAccessor(v: ValAccessor): T;
  visitLiteral(l: Literal): T;
  visitBinary(b: BinaryExpression): T;
  visitComparison(c: ComparisonExpression): T;
  visitInstantiation(i: Instantiation): T;
}

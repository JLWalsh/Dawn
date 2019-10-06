import {Expression, ExpressionType} from "@dawn/lang/ast/Expression";
import {Token} from "@dawn/parsing/Token";

export interface BinaryExpression extends Expression {
  type: ExpressionType.BINARY,
  left: Expression;
  operator: Token;
  right: Expression;
}
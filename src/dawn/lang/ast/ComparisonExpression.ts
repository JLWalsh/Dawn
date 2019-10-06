import {Expression} from "@dawn/lang/ast/Expression";
import {Token} from "@dawn/parsing/Token";

export interface ComparisonExpression extends Expression {
  left: Expression;
  comparisonOperator: Token;
  right: Expression;
}
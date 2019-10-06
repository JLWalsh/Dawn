import {Expression} from "@dawn/lang/ast/Expression";
import {Token} from "@dawn/parsing/Token";

export interface EqualityExpression extends Expression {
  left: Expression;
  equalityOperator: Token;
  right: Expression;
}
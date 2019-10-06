import {Expression, StatementType} from "@dawn/lang/ast/Expression";
import {Token} from "@dawn/parsing/Token";

export interface BinaryExpression extends Expression {
  type: StatementType.BINARY,
  left: Expression;
  operator: Token;
  right: Expression;
}
import {Expression} from "@dawn/lang/ast/Expression";
import {StatementType} from "@dawn/lang/ast/Statement";
import {Token} from "@dawn/parsing/Token";

export interface VariableExpression extends Expression {
  type: StatementType.VARIABLE;
  name: Token;
}
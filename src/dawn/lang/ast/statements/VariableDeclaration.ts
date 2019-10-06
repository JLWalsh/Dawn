import {Statement, StatementType} from "@dawn/lang/ast/Statement";
import {Token} from "@dawn/parsing/Token";
import {Expression} from "@dawn/lang/ast/Expression";

export interface VariableDeclaration extends Statement {
  type: StatementType.VARIABLE_DECLARATION;
  name: Token;
  initializer: Expression;
}
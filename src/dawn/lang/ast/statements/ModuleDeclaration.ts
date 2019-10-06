import {Statement, StatementType} from "@dawn/lang/ast/Statement";
import {Token} from "@dawn/parsing/Token";

export interface ModuleDeclaration extends Statement {
  type: StatementType.MODULE_DECLARATION;
  name: Token;
  body: Statement[];
}
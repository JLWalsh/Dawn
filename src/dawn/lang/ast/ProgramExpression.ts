import {Expression, StatementType} from "@dawn/lang/ast/Expression";

export interface ProgramExpression extends Expression {
  type: StatementType.PROGRAM,
  instructions: Expression[];
}
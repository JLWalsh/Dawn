import {Expression, ExpressionType} from "@dawn/lang/ast/Expression";

export interface ProgramExpression extends Expression {
  type: ExpressionType.PROGRAM,
  instructions: Expression[];
}
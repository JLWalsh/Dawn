
export enum ExpressionType {
  PROGRAM,
  BINARY,
  UNARY,
  LITERAL,
  GROUPING,
}

export interface Expression {
  type: ExpressionType;
}
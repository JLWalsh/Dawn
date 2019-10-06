export enum StatementType {
  PROGRAM,
  BINARY,
  UNARY,
  LITERAL,
  GROUPING,
  EQUALITY,
  COMPARISON,
  VARIABLE_DECLARATION,
  MODULE_DECLARATION,
  VARIABLE,
}

export interface Statement {
  type: StatementType;
}
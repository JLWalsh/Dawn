import {Token} from "@dawn/parsing/Token";

export enum StatementType {
  PROGRAM,
  IMPORT,
  EXPORT,

  OBJECT_DECLARATION,
  MODULE_DECLARATION,
  FUNCTION_DECLARATION,
  VAL_DECLARATION,

  EQUALITY,
  COMPARISON,
  BINARY,
  UNARY,
  LITERAL,

  ACCESSOR,
  VALACCESSOR,

  INVOCATION,
}

export interface Statement {
  type: StatementType;
  reference: Token;
}
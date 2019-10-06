import {Token} from "@dawn/parsing/Token";

export enum AstNodeType {
  PROGRAM,
  IMPORT,
  EXPORT,
  RETURN,

  OBJECT_DECLARATION,
  MODULE_DECLARATION,
  FUNCTION_DECLARATION,
  FUNCTION_DECLARATION_ARGUMENT,
  VAL_DECLARATION,

  EQUALITY,
  COMPARISON,
  BINARY,
  UNARY,
  LITERAL,

  ACCESSOR,
  VALACCESSOR,

  INVOCATION,
  INSTANTIATION,
}

export interface AstNode {
  type: AstNodeType;
  reference: Token;
}
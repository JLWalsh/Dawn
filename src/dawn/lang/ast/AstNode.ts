export enum AstNodeType {
  IMPORT,
  EXPORT,
  RETURN,

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

  INSTANTIATION,
}

export interface AstNode {
  type: AstNodeType;
}



export enum TokenType {
  IMPORT,
  MODULE,
  EXPORT,
  OBJECT,
  VAL,
  RETURN,

  BRACKET_OPEN,
  BRACKET_CLOSE,
  PAREN_OPEN,
  PAREN_CLOSE,

  IDENTIFIER,

  FLOAT_NUMBER,
  INT_NUMBER,

  DOT,
  COLON,
  HYPHEN,
  COMMA,
  PLUS,

  // Equality
  EQUALS_EQUALS,
  BANG_EQUALS,

  // Comparison
  GREATER_THAN,
  LESS_THAN,
  GREATER_OR_EQUAL,
  LESS_OR_EQUAL,

  STAR,
  FORWARD_SLASH,
  BANG,
  EQUALS,
}

export interface Token {
  type: TokenType;
  value?: any;
  lexeme: string;
}

export enum TokenType {
  IMPORT,
  MODULE,
  EXPORT,
  OBJECT,
  VAL,

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
  EQUALS,
  COMMA,

  STAR,
  UPTICK,
}

export interface Token {
  type: TokenType;
  value?: any;
  lexeme: string;
}
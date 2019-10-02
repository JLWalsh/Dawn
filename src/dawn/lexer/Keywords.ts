import {TokenType} from "@dawn/lexer/Token";

interface Keywords {
  [keyword: string]: TokenType;
}

export const keywords: Keywords = {
  'module': TokenType.MODULE,
  'import': TokenType.IMPORT,
  'export': TokenType.EXPORT,
  'object': TokenType.OBJECT,
  'val': TokenType.VAL,
};
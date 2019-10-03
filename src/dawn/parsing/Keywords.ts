import {TokenType} from "@dawn/parsing/Token";

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
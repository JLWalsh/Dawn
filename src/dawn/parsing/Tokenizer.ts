import {Token, TokenType} from "@dawn/parsing/Token";
import {Char} from "@dawn/lang/Char";
import {SupportedNumbers} from "@dawn/lang/Numbers";
import {keywords} from "@dawn/parsing/Keywords";
import {StringIterableReader} from "@dawn/parsing/StringIterableReader";

export function tokenize(reader: StringIterableReader): { tokens: Token[], errors: string[] } {
  const tokens: Token[] = [];
  const errors: string[] = [];
  let recoverFromError = false;

  function addSingleToken(type: TokenType) {
    const lexeme = reader.extract() as string;
    tokens.push({ type, lexeme });
  }

  function error(name: string) {
    errors.push(`(${reader.getLine() + 1}, ${reader.getColumn()}) ${name}`);
    recoverFromError = true;
  }

  while(!reader.isAtEnd()) {
    reader.resetExtract();
    const char = reader.advance();

    if(recoverFromError) {
      recover();
      recoverFromError = false;
    }

    switch(char) {
      case '{': addSingleToken(TokenType.BRACKET_OPEN); break;
      case '}': addSingleToken(TokenType.BRACKET_CLOSE); break;
      case '(': addSingleToken(TokenType.PAREN_OPEN); break;
      case ')': addSingleToken(TokenType.PAREN_CLOSE); break;
      case '*': addSingleToken(TokenType.STAR); break;
      case ':': addSingleToken(TokenType.COLON); break;
      case '.': addSingleToken(TokenType.DOT); break;
      case ',': addSingleToken(TokenType.COMMA); break;
      case '/': addSingleToken(TokenType.FORWARD_SLASH); break;
      case '+': addSingleToken(TokenType.PLUS); break;
      case '\n': break;
      case '\r': break;
      case ' ': break;
      case '!': {
        if (reader.peek() == '=') {
          reader.advance();
          addSingleToken(TokenType.BANG_EQUALS);
        } else {
          addSingleToken(TokenType.BANG);
        }
        break;
      }
      case '=': {
        if (reader.peek() == '=') {
          reader.advance();
          addSingleToken(TokenType.EQUALS_EQUALS);
        } else {
          addSingleToken(TokenType.EQUALS);
        }
      } break;
      case '>': {
        if (reader.peek() === '=') {
          reader.advance();
          addSingleToken(TokenType.GREATER_OR_EQUAL);
        } else {
          addSingleToken(TokenType.GREATER_THAN);
        }
      } break;
      case '<': {
        if (reader.peek() === '=') {
          reader.advance();
          addSingleToken(TokenType.LESS_OR_EQUAL);
        } else {
          addSingleToken(TokenType.LESS_THAN);
        }
      } break;
      case '-': {
        if (Char.isNumber(reader.peek())) {
          parseNumber();
          break;
        }

        addSingleToken(TokenType.HYPHEN);
        break;
      }
      default: {
        if (Char.isAlpha(char)) {
          parseIdentifier();
          break;
        }

        if (Char.isNumber(char)) {
          parseNumber();
          break;
        }

        error(`Unrecognized character: ${char}`);
      }
    }
  }

  function parseIdentifier() {
    while(!reader.isAtEnd() && Char.isAlpha(reader.peek())) {
      reader.advance();
    }

    const lexeme = reader.extract() as string;
    // TODO use null coalescing when Typescript 3.7 is released
    const keyword = keywords[lexeme];
    const type = keyword === undefined ? TokenType.IDENTIFIER : keyword;

    tokens.push({ type, lexeme, value: lexeme });
  }

  function parseNumber() {
    while(!reader.isAtEnd() && Char.isNumber(reader.peek())) {
      reader.advance();
    }

    let hasDecimals = false;
    if (reader.match('.')) {
      while(!reader.isAtEnd() && Char.isNumber(reader.peek())) {
        hasDecimals = true;
        reader.advance();
      }
    }

    if (reader.peek() != SupportedNumbers.FLOAT && reader.peek() != SupportedNumbers.INT) {
      error(`Unspecified number type`);
      return;
    }

    const type = reader.advance() as SupportedNumbers;
    const tokenType = type === SupportedNumbers.INT ? TokenType.INT_NUMBER : TokenType.FLOAT_NUMBER;

    if (tokenType === TokenType.INT_NUMBER && hasDecimals) {
      error(`Int may not contain decimals`);
      return;
    }

    const lexeme = reader.extract() as string;
    const value = Number(lexeme.substr(0, lexeme.length - 1));
    tokens.push({ type: tokenType, lexeme, value });
  }

  function recover() {
    while(reader.peek() != '\n' && !reader.isAtEnd()) {
      reader.advance();
    }
  }

  return { tokens, errors };
}
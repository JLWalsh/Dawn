import {Token, TokenType} from "@dawn/lexer/Token";
import {Char} from "@dawn/lang/Char";
import {SupportedNumbers} from "@dawn/lang/Numbers";
import {keywords} from "@dawn/lexer/Keywords";

export function tokenize(program: string): { tokens: Token[], errors: string[] } {
  const tokens: Token[] = [];
  const errors: string[] = [];
  let position = 0;
  let tokenStartPosition = 0;
  let recoverFromError = false;

  function isAtEnd() {
    return position >= program.length;
  }

  function peek() {
    return program[position];
  }

  function advance() {
    return program[position++];
  }

  function match(nextChar: string) {
    if (peek() != nextChar) {
      return false;
    }

    return advance();
  }

  function extractLexeme() {
    return program.substring(tokenStartPosition, position);
  }

  function addSingleToken(type: TokenType) {
    const lexeme = extractLexeme();
    tokens.push({ type, lexeme });
  }

  function error(name: string) {
    errors.push(name);
    recoverFromError = true;
  }

  while(!isAtEnd()) {
    tokenStartPosition = position;
    const char = advance();

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
      case '^': addSingleToken(TokenType.UPTICK); break;
      case ':': addSingleToken(TokenType.COLON); break;
      case '.': addSingleToken(TokenType.DOT); break;
      case '\n': break;
      case '\r': break;
      case ' ': break;
      case '-': {
        if (Char.isNumber(peek())) {
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
    while(!isAtEnd() && Char.isAlpha(peek())) {
      advance();
    }

    const lexeme = extractLexeme();
    // TODO use null coalescing when Typescript 3.7 is released
    const keyword = keywords[lexeme];
    const type = keyword === undefined ? TokenType.IDENTIFIER : keyword;

    tokens.push({ type, lexeme, value: lexeme });
  }

  function parseNumber() {
    while(!isAtEnd() && Char.isNumber(peek())) {
      advance();
    }

    let hasDecimals = false;
    if (match('.')) {
      while(!isAtEnd() && Char.isNumber(peek())) {
        hasDecimals = true;
        advance();
      }
    }

    if (peek() != SupportedNumbers.FLOAT && peek() != SupportedNumbers.INT) {
      error(`Unspecified number type`);
      return;
    }

    const type = advance() as SupportedNumbers;
    const tokenType = type === SupportedNumbers.INT ? TokenType.INT_NUMBER : TokenType.FLOAT_NUMBER;

    if (tokenType === TokenType.INT_NUMBER && hasDecimals) {
      error(`Int may not contain decimals`);
      return;
    }

    const lexeme = extractLexeme();
    const value = Number(program.substring(tokenStartPosition, position - 1));
    tokens.push({ type: tokenType, lexeme, value });
  }

  function recover() {
    while(peek() != '\n' && !isAtEnd()) {
      advance();
    }
  }

  return { tokens, errors };
}
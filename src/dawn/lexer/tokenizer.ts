import {Token, TokenType} from "@dawn/lexer/Token";
import {Char} from "@dawn/lang/Char";
import {SupportedNumbers} from "@dawn/lang/Numbers";

export function tokenize(program: string): Token[] {
  const tokens: Token[] = [];
  let position = 0;
  let tokenStartPosition = 0;

  function isAtEnd() {
    return position >= program.length;
  }

  function peek() {
    return program[position + 1];
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

  while(!isAtEnd()) {
    tokenStartPosition = position;
    const char = advance();

    switch(char) {
      case '{': addSingleToken(TokenType.BRACKET_OPEN); break;
      case '}': addSingleToken(TokenType.BRACKET_CLOSE); break;
      case '(': addSingleToken(TokenType.PAREN_OPEN); break;
      case ')': addSingleToken(TokenType.PAREN_CLOSE); break;
      case '*': addSingleToken(TokenType.STAR); break;
      case '^': addSingleToken(TokenType.UPTICK); break;
      case ':': addSingleToken(TokenType.COLON); break;
      case '\n': break;
      case '\r': break;
      case ' ': break;
      default:
        if (Char.isAlpha(char)) {

          break;
        }

        if (Char.isNumber(char)) {
          parseNumber();
          break;
        }

        throw new Error(`Unrecognized character: ${char}`);
    }
  }

  function parseNumber() {
    while(Char.isNumber(peek()) && !isAtEnd()) {
      advance();
    }

    if (match('.')) {
      while(Char.isNumber(peek()) && !isAtEnd()) {
        advance();
      }
    }

    if (peek() != SupportedNumbers.FLOAT && peek() != SupportedNumbers.INT) {
      throw new Error(`Unspecified number type`);
    }

    const type = advance() as SupportedNumbers;
    const tokenType = type === SupportedNumbers.INT ? TokenType.INT_NUMBER : TokenType.FLOAT_NUMBER;

    const lexeme = extractLexeme();
    const value = Number(program.substring(tokenStartPosition, position - 1));
    tokens.push({ type: tokenType, lexeme, value });
  }

  return [];
}
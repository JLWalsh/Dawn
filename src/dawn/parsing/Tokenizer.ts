import {Token, TokenType} from "@dawn/parsing/Token";
import {Char} from "@dawn/lang/Char";
import {SupportedNumbers} from "@dawn/lang/Numbers";
import {keywords} from "@dawn/parsing/Keywords";
import {StringIterableReader} from "@dawn/parsing/StringIterableReader";
import {DiagnosticMeta, DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";

export function tokenize(reader: StringIterableReader, diagnosticReporter: DiagnosticReporter): Token[] {
  const tokens: Token[] = [];
  let recoverFromError = false;

  function addSingleToken(type: TokenType) {
    const { lexeme, location }  = reader.extract();
    tokens.push({ type, lexeme, location });
  }

  function error(name: string, meta?: DiagnosticMeta) {
    diagnosticReporter.report(name, { ...meta, location: reader.getLexemeLocation() });
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
        if (reader.safePeek(Char.isNumber)) {
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

        error('UNRECOGNIZED_CHARACTER', { templating: { character: char } });
      }
    }
  }

  function parseIdentifier() {
    while(reader.safePeek(Char.isAlpha)) {
      reader.advance();
    }

    const { lexeme, location } = reader.extract();
    // TODO use null coalescing when Typescript 3.7 is released
    const keyword = keywords[lexeme];
    const type = keyword === undefined ? TokenType.IDENTIFIER : keyword;

    tokens.push({ type, lexeme, value: lexeme, location: location });
  }

  function parseNumber() {
    while(reader.safePeek(Char.isNumber)) {
      reader.advance();
    }

    let hasDecimals = false;
    if (reader.match('.')) {
      while(reader.safePeek(Char.isNumber)) {
        hasDecimals = true;
        reader.advance();
      }
    }

    if (reader.peek() != SupportedNumbers.FLOAT && reader.peek() != SupportedNumbers.INT) {
      error('EXPECTED_TYPE_FOR_NUMBER');
      return;
    }

    const type = reader.advance() as SupportedNumbers;
    const tokenType = type === SupportedNumbers.INT ? TokenType.INT_NUMBER : TokenType.FLOAT_NUMBER;

    if (tokenType === TokenType.INT_NUMBER && hasDecimals) {
      error('INT_MAY_NOT_CONTAIN_DECIMALS');
      return;
    }

    const { lexeme, location } = reader.extract();
    const value = Number(lexeme.substr(0, lexeme.length - 1));
    tokens.push({ type: tokenType, lexeme, value, location });
  }

  function recover() {
    while(reader.peek() != '\n' && !reader.isAtEnd()) {
      reader.advance();
    }
  }

  return tokens;
}

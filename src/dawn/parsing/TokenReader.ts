import {IterableReader} from "@dawn/parsing/IterableReader";
import {Token, TokenType} from "@dawn/parsing/Token";
import {ParseError} from "@dawn/parsing/ParseError";
import {DiagnosticTemplateValues} from "@dawn/ui/DiagnosticReporter";

export class TokenReader extends IterableReader<Token> {

  constructor(
    tokens: Token[],
  ) {
    super(tokens);
  }

  peekAt(offset: number = 0) {
    return this.content[this.getPosition() + offset];
  }

  consume(tokenType: TokenType, diagnosticCode: string, diagnosticTemplateValues?: DiagnosticTemplateValues): Token {
    const token = this.match(tokenType);
    if(!token) {
      throw new ParseError(diagnosticCode, diagnosticTemplateValues || {});
    }

    return this.previous();
  }

  previous() {
    return this.content[this.getPosition() - 1];
  }

  match(...anyOf: TokenType[]): boolean {
    if (this.isAtEnd()) {
      return false;
    }

    const matchingToken = anyOf.find(t => this.peek().type === t);
    if (matchingToken === undefined) {
      return false;
    }

    this.advance();
    return true;
  }
}
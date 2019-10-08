import {IterableReader} from "@dawn/parsing/IterableReader";
import {Token, TokenType} from "@dawn/parsing/Token";

export class TokenReader extends IterableReader<Token> {

  constructor(
    tokens: Token[],
  ) {
    super(tokens);
  }

  peekAt(offset: number = 0) {
    return this.content[this.getPosition() + offset];
  }

  consume(tokenType: TokenType, errorIfNotPresent: string): Token {
    const token = this.match(tokenType);
    if(!token) {
      throw new Error(`(${this.getPosition()}) ${errorIfNotPresent}`);
    }

    return this.previous();
  }

  previous() {
    return this.content[this.getPosition() - 1];
  }

  match(...anyOf: TokenType[]): boolean {
    const matchingToken = anyOf.find(t => this.peek().type === t);
    if (matchingToken === undefined) {
      return false;
    }

    this.advance();
    return true;
  }
}
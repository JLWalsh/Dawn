import {IterableReader} from "@dawn/parsing/IterableReader";
import {Token, TokenType} from "@dawn/parsing/Token";

export class TokenReader extends IterableReader<Token> {

  constructor(
    tokens: Token[],
  ) {
    super(tokens);
  }

  consume(tokenType: TokenType, errorIfNotPresent: string): Token {
    const token = this.match(tokenType);
    if(!token) {
      throw new Error(errorIfNotPresent);
    }

    return this.previous();
  }

  previous() {
    return this.content[this.getPosition() - 1];
  }

  match(...anyOf: TokenType[]): boolean {
    const matchingToken = anyOf.find(t => this.peek().type === t);
    if (!matchingToken) {
      return false;
    }

    this.advance();
    return true;
  }
}
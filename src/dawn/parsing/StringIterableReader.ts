import {IterableReader} from "@dawn/parsing/IterableReader";

export class StringIterableReader extends IterableReader<string> {

  constructor(
    content: string,
    private column = 0,
    private lineNumber = 0,
    private nextExtractStart = 0,
  ) {
    super(content);
  }

  advance(): string {
    this.column++;

    const token = super.advance();
    if (token === '\n') {
      this.newline();
    }

    return super.advance();
  }

  extract(): ArrayLike<string> {
    return (this.content as string).substring(this.nextExtractStart, this.getPosition());
  }

  resetExtract() {
    this.nextExtractStart = this.getPosition();
  }

  getColumn() {
    return this.column;
  }

  getLine() {
    return this.lineNumber;
  }

  private newline() {
    this.lineNumber++;
    this.column = 0;
  }
}
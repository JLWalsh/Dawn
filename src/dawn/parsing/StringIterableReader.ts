import {IterableReader} from "@dawn/parsing/IterableReader";
import {ProgramLocation} from "@dawn/ui/ProgramLocation";

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

    return token;
  }

  extract(): { lexeme: string, location: ProgramLocation } {
    const value = (this.content as string).substring(this.nextExtractStart, this.getPosition());
    const location = { row: this.lineNumber + 1, column: this.column - value.length + 1 }; // Rows and columns are not 0-indexed

    return { lexeme: value, location };
  }


  match(nextOccurence: string): boolean | string {
    if (this.peek() != nextOccurence) {
      return false;
    }

    return this.advance();
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

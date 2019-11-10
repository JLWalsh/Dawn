import {IterableReader} from "@dawn/parsing/IterableReader";
import {ProgramLocation} from "@dawn/ui/ProgramLocation";

export class StringIterableReader extends IterableReader<string> {

  private static readonly FIRST_CHAR_LENGTH = 1;

  private nextExtractLocation: ProgramLocation;

  constructor(
    content: string,
    private column = 0,
    private lineNumber = 0,
    private nextExtractStart = 0,
  ) {
    super(content);

    this.nextExtractLocation = this.getLocation();
  }

  safePeek(predicate: (char: string) => boolean) {
    const peekedValue = this.peek();
    if (!peekedValue) {
      return false;
    }

    return predicate(peekedValue);
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

    return { lexeme: value, location: this.getLexemeLocation() };
  }


  match(nextOccurence: string): boolean | string {
    if (this.peek() != nextOccurence) {
      return false;
    }

    return this.advance();
  }

  resetExtract() {
    this.nextExtractStart = this.getPosition();
    this.nextExtractLocation = this.getLocation();
  }

  getLexemeLocation(): ProgramLocation {
    const span = this.getPosition() - this.nextExtractStart - StringIterableReader.FIRST_CHAR_LENGTH;
    return { ...this.nextExtractLocation, span };
  }

  private getLocation(): ProgramLocation {
    return { row: this.lineNumber + 1, column: this.column + 1 };
  }

  private newline() {
    this.lineNumber++;
    this.column = 0;
  }
}

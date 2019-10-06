
interface ArrayLike<T> {
  [key: number]: T;
  length: number;
}

export class IterableReader<T> {

  constructor(
    protected readonly content: ArrayLike<T>,
    private position = 0,
  ) {}

  advance(): T {
    return this.content[this.position++];
  }

  advanceOrThrow(errorMessage: string): T {
    if (this.isAtEnd()) {
      throw new Error(errorMessage);
    }

    return this.advance();
  }

  peek(): T {
    return this.content[this.position];
  }

  isAtEnd(): boolean {
    return this.position >= this.content.length;
  }

  getPosition() {
    return this.position;
  }

}

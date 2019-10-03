
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

  peek(): T {
    return this.content[this.position];
  }

  isAtEnd(): boolean {
    return this.position >= this.content.length;
  }

  match(nextOccurence: T): boolean | T {
    if (this.peek() != nextOccurence) {
      return false;
    }

    return this.advance();
  }

  getPosition() {
    return this.position;
  }

}

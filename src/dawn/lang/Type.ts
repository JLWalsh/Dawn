
export class Type {

  static readonly DefaultTypes = {
    function: Type.named("function")
  };

  static named(name: string) {
    return new Type(name);
  }

  private constructor(
    public readonly name: string,
  ) {}
}
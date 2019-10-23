
export abstract class ConstantSymbol {

  constructor(
    private readonly name: string,
    private readonly containedIn: ConstantSymbol | void,
  ) {}

  getContainedIn() {
    return this.containedIn;
  }

  getName() {
    return this.name;
  }
}

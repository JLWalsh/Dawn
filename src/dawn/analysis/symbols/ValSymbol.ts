import {ISymbol} from "@dawn/analysis/symbols/ISymbol";

export class ValSymbol implements ISymbol {

  constructor(
    private readonly name: string,
  ) {}

  getName(): string {
    return this.name;
  }
}

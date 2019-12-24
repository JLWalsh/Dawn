import {ISymbol} from "@dawn/analysis/symbols/ISymbol";

export class ExportedSymbol implements ISymbol {

  constructor(
    private readonly symbol: ISymbol,
  ) {}

  getName(): string {
    return this.symbol.getName();
  }
}

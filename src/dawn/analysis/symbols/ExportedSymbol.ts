import {ISymbol, ISymbolVisibility} from "@dawn/analysis/symbols/ISymbol";
import {Scope} from "@dawn/analysis/Scope";

export class ExportedSymbol implements ISymbol {

  constructor(
    private readonly symbol: ISymbol,
  ) {}

  getName(): string {
    return this.symbol.getName();
  }

  isVisibility(visibility: ISymbolVisibility): boolean {
    return visibility === ISymbolVisibility.EXPORTED;
  }

  getSymbol() {
    return this.symbol;
  }

  getScope(): Scope | void {
    return this.symbol.getScope();
  }

}

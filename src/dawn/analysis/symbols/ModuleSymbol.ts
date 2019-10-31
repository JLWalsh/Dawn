import {ISymbol, SymbolVisibility} from "@dawn/analysis/symbols/ISymbol";

export class ModuleSymbol implements ISymbol {

  public readonly visibility: SymbolVisibility;

  constructor(
    private readonly symbols: Map<string, ISymbol> = new Map(),
    private readonly parentModule: ModuleSymbol | void,
    visibility: SymbolVisibility
  ) {
    this.visibility = visibility;
  }

  upwardsLookup(symbolName: string): ISymbol | void {
    const symbol = this.symbols.get(symbolName);
    if (symbol) {
      return symbol;
    }

    if (this.parentModule) {
      return this.parentModule.upwardsLookup(symbolName);
    }
  }

  downwardsLookup(symbolName: string): ISymbol | void {
    const symbol = this.symbols.get(symbolName);
    if (symbol && symbol.visibility === SymbolVisibility.EXPORTED) {
      return symbol;
    }
  }
}

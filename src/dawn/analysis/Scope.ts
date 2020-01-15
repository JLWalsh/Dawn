import {ISymbol} from "@dawn/analysis/symbols/ISymbol";

export class Scope {

  constructor(
    private readonly parent: Scope | void,
    private readonly symbols: Map<string, ISymbol> = new Map(),
  ) {}

  lookup(name: string): ISymbol | void {
    const symbol = this.symbols.get(name);

    return symbol || (this.parent && this.parent.lookup(name));
  }

  define(symbol: ISymbol) {
    const symbolName = symbol.getName();
    if (this.symbols.has(symbolName)) {
      throw new Error('Symbol is already defined');
    }

    this.symbols.set(symbolName, symbol);
  }
}

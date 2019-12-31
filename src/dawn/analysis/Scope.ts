import {ISymbol} from "@dawn/analysis/symbols/ISymbol";

export class Scope {

  static withSymbols(...symbols: ISymbol[]): Scope {
    const scope = new Scope();
    symbols.forEach(symbol => scope.addSymbol(symbol));

    return scope;
  }

  constructor(
    private readonly parent: Scope | void,
    private readonly symbols: Map<string, ISymbol> = new Map(),
  ) {}

  lookup(name: string): ISymbol | void {
    const symbolFound = this.getSymbol(name);
    if (symbolFound) {
      return symbolFound;
    }

    if (this.parent) {
      return this.parent.lookup(name);
    }
  }

  addSymbol(...symbols: ISymbol[]) {
    symbols.forEach(symbol => {
      this.symbols.set(symbol.getName(), symbol);
    });
  }

  listSymbolsMatching<T extends ISymbol>(predicate: (symbol: ISymbol) => symbol is T): T[] {
    const symbols: T[] = [];

    for (const symbol of this.symbols.values()) {
      if (predicate(symbol)) {
        symbols.push(symbol);
      }
    }

    return symbols;
  }

  getSymbol(name: string): ISymbol | void {
    return this.symbols.get(name);
  }

  getAllSymbols(): ISymbol[] {
    return Array.from(this.symbols.values());
  }
}

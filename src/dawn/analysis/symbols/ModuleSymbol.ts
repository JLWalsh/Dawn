import {ISymbol, SymbolVisibility} from "@dawn/analysis/symbols/ISymbol";
import {SymbolAlreadyDefinedError} from "@dawn/analysis/symbols/errors/SymbolAlreadyDefinedError";

export class ModuleSymbol implements ISymbol {

  public readonly visibility: SymbolVisibility;

  constructor(
    visibility: SymbolVisibility,
    private readonly parentModule: ModuleSymbol | void = undefined,
    private readonly symbols: Map<string, ISymbol> = new Map(),
) {
    this.visibility = visibility;
  }

  define(symbolName: string, symbol: ISymbol) {
    const existingSymbol = this.symbols.get(symbolName);
    if (existingSymbol) {
      throw new SymbolAlreadyDefinedError(existingSymbol);
    }

    this.symbols.set(symbolName, symbol);
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

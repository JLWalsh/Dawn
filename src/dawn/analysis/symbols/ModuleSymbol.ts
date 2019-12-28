import {ISymbol, ISymbolVisibility} from "@dawn/analysis/symbols/ISymbol";
import {Scope} from "@dawn/analysis/scopes/Scope";

export class ModuleSymbol implements ISymbol {

  constructor(
    private readonly name: string,
    private readonly scope: Scope = new Scope(),
  ) {}

  getName(): string {
    return this.name;
  }

  getScope() {
    return this.scope;
  }

  isVisibility(visibility: ISymbolVisibility): boolean {
    return visibility === ISymbolVisibility.INTERNAL;
  }

  // define(symbolName: string, symbol: ISymbol) {
  //   const existingSymbol = this.symbols.get(symbolName);
  //   if (existingSymbol) {
  //     throw new SymbolAlreadyDefinedError(existingSymbol, symbol);
  //   }
  //
  //   this.symbols.set(symbolName, symbol);
  // }
  //
  // upwardsLookup(symbolName: string): ISymbol | void {
  //   const symbol = this.symbols.get(symbolName);
  //   if (symbol) {
  //     return symbol;
  //   }
  //
  //   if (this.parentModule) {
  //     return this.parentModule.upwardsLookup(symbolName);
  //   }
  // }
  //
  // downwardsLookup(symbolName: string): ISymbol | void {
  //   const symbol = this.symbols.get(symbolName);
  //   if (symbol && symbol.visibility === SymbolVisibility.EXPORTED) {
  //     return symbol;
  //   }
  // }
  //
  // get(symbolName: string): ISymbol | void {
  //   return this.symbols.get(symbolName);
  // }
  //
  // getParent() {
  //   return this.parentModule;
  // }
  //
  // getSymbols() {
  //   return this.symbols;
  // }
}


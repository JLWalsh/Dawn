import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
import {ModuleScope} from "@dawn/analysis/scopes/ModuleScope";

export class ModuleSymbol implements ISymbol {

  constructor(
    private readonly name: string,
    private readonly scope: ModuleScope,
  ) {}

  getName(): string {
    return name;
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


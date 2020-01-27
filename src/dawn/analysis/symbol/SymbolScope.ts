import {ISymbol} from "@dawn/analysis/symbol/ISymbol";

export interface SymbolScope {
  // Symbols are mapped to an array of symbols, as multiple symbols can posess the same name
  // Ex: a function with multiple implementations
  symbols: Map<string, ISymbol>;
  parent?: SymbolScope;
  childScopes: Map<string, SymbolScope>;
}


import {IModuleSymbol} from "@dawn/analysis/symbols/IModuleSymbol";
import {SymbolKind} from "@dawn/analysis/symbols/SymbolKind";
import {ITypeSymbol} from "@dawn/analysis/symbols/ITypeSymbol";

export interface ISymbol {
  getKind(): SymbolKind;

  getName(): string;

  // The module that the symbol resides in
  getContainingModule(): IModuleSymbol | void;

  // The symbol that holds this symbol
  getContainingSymbol(): ISymbol | void;

  // The type that holds this symbol
  getContainingType(): ITypeSymbol | void;
}


import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
import {SymbolKind} from "@dawn/analysis/symbols/SymbolKind";
import {ITypeSymbol} from "@dawn/analysis/symbols/ITypeSymbol";

export interface IObjectPropertySymbol extends ISymbol {
  getKind(): SymbolKind.OBJECT_PROP;

  getType(): ITypeSymbol;

  getVisibity(): IObjectPropertySymbolVisibility;
}

export enum IObjectPropertySymbolVisibility {
  PUBLIC, // Property is accessible from all module
  PRIVATE // Property is only accessible from this module (or children modules)
}

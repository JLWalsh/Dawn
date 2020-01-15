import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
import {SymbolKind} from "@dawn/analysis/symbols/SymbolKind";
import {ITypeSymbol} from "@dawn/analysis/symbols/ITypeSymbol";

export interface IArgumentSymbol extends ISymbol {
  getKind(): SymbolKind.ARGUMENT;

  getType(): ITypeSymbol;
}

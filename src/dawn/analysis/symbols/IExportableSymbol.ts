import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
import {SymbolVisibility} from "@dawn/analysis/symbols/SymbolVisibility";

export interface IExportableSymbol extends ISymbol {
  getVisibility(): SymbolVisibility;
}

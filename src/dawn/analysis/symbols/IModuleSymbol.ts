import {SymbolKind} from "@dawn/analysis/symbols/SymbolKind";
import {IExportableSymbol} from "@dawn/analysis/symbols/IExportableSymbol";
import {ISymbol} from "@dawn/analysis/symbols/ISymbol";

export interface IModuleSymbol extends IExportableSymbol {
  getKind(): SymbolKind.MODULE;

  getMembers(): ISymbol[];
}

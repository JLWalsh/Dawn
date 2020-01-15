import {IExportableSymbol} from "@dawn/analysis/symbols/IExportableSymbol";
import {SymbolKind} from "@dawn/analysis/symbols/SymbolKind";
import {IObjectPropertySymbol} from "@dawn/analysis/symbols/IObjectPropertySymbol";

export interface IObjectSymbol extends IExportableSymbol {
  getKind(): SymbolKind.OBJECT_DECL;

  getProperty(name: string): IObjectPropertySymbol | void;

  getProperties(): IObjectPropertySymbol[];
}

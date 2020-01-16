import {IExportableSymbol} from "@dawn/analysis/symbols/IExportableSymbol";
import {SymbolKind} from "@dawn/analysis/symbols/SymbolKind";
import {IObjectPropertySymbol} from "@dawn/analysis/symbols/IObjectPropertySymbol";
import {ITypeSymbol} from "@dawn/analysis/symbols/ITypeSymbol";

export interface IObjectSymbol extends IExportableSymbol, ITypeSymbol {
  getKind(): SymbolKind.OBJECT_DECL;

  getProperty(name: string): IObjectPropertySymbol | void;

  getProperties(): IObjectPropertySymbol[];
}


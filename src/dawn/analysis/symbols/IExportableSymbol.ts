import {ISymbol} from "@dawn/analysis/symbols/ISymbol";

export interface IExportableSymbol extends ISymbol {
  getVisibility(): IExportableSymbolVisibility;
}

export enum IExportableSymbolVisibility {
  INTERNAL,
  EXPORTED
}

import {IExportableSymbol} from "@dawn/analysis/symbols/IExportableSymbol";
import {ITypeSymbol} from "@dawn/analysis/symbols/ITypeSymbol";
import {SymbolKind} from "@dawn/analysis/symbols/SymbolKind";
import {IArgumentSymbol} from "@dawn/analysis/symbols/IArgumentSymbol";

export interface IFunctionSymbol extends IExportableSymbol {
  getKind(): SymbolKind.FUNCTION;

  getReturnType(): ITypeSymbol | void;

  getArguments(): IArgumentSymbol[];
}

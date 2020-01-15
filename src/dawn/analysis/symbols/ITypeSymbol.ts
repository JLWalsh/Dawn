import {IExportableSymbol} from "@dawn/analysis/symbols/IExportableSymbol";
import {SymbolKind} from "@dawn/analysis/symbols/SymbolKind";
import {TypeKind} from "@dawn/analysis/typechecking/TypeKind";

export interface ITypeSymbol extends IExportableSymbol {
  getKind(): SymbolKind.TYPE;

  getTypeKind(): TypeKind;
}

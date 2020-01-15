import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
import {ITypeSymbol} from "@dawn/analysis/symbols/ITypeSymbol";
import {SymbolKind} from "@dawn/analysis/symbols/SymbolKind";

export interface IValSymbol extends ISymbol {
  getKind(): SymbolKind.VAL;
  getValType(): ITypeSymbol;
}


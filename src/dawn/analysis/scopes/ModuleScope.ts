import {Scope} from "@dawn/analysis/scopes/Scope";
import {ISymbol} from "@dawn/analysis/symbols/ISymbol";

export class ModuleScope implements Scope {

  addInternalSymbol(symbol: ISymbol) {

  }

  addExportedSymbol(symbol: ISymbol) {

  }

  getChildren(): Scope[] {
    return [];
  }

}

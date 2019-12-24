import {Scope} from "@dawn/analysis/scopes/Scope";
import {ISymbol} from "@dawn/analysis/symbols/ISymbol";

export class GlobalScope implements Scope {
  getChildren(): Scope[] {
    return [];
  }

  addSymbol(symbol: ISymbol): void {
  }

}

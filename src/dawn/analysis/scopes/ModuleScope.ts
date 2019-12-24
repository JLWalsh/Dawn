import {Scope} from "@dawn/analysis/scopes/Scope";
import {ISymbol} from "@dawn/analysis/symbols/ISymbol";

export class ModuleScope implements Scope {

  constructor(
    private readonly internalSymbols: ISymbol[] = [],
    private readonly exportedSymbols: ISymbol[] = [],
  ) {}

  getChildren(): Scope[] {
    return [];
  }

  addSymbol(symbol: ISymbol): void {
  }

  getSymbol(name: string): ISymbol | void {
    return undefined;
  }

}

import {Accessor} from "@dawn/lang/ast/Accessor";
import {ISymbol, ISymbolVisibility} from "@dawn/analysis/symbols/ISymbol";
import {Scope} from "@dawn/analysis/Scope";

export class SymbolResolver {

  resolve(symbolValue: Accessor, currentScope: Scope): ISymbol | void {
    const symbol = currentScope.lookup(symbolValue.name);
    if (!symbol) {
      return;
    }

    if (symbolValue.subAccessor) {
      const symbolChildren = symbol.getScope();
      if (symbolChildren) {
        return this.downwardsResolve(symbolValue.subAccessor, symbolChildren);
      }

      return;
    }

    return symbol;
  }

  private downwardsResolve(symbolValue: Accessor, currentScope: Scope): ISymbol | void {
    const symbol = currentScope.getSymbol(symbolValue.name);
    if (!symbol || !symbol.isVisibility(ISymbolVisibility.EXPORTED)) {
      return;
    }

    if (symbolValue.subAccessor) {
      const symbolScope = symbol.getScope();
      if (symbolScope) {
        return this.downwardsResolve(symbolValue.subAccessor, symbolScope);
      }

      return;
    }

    return symbol;
  }
}

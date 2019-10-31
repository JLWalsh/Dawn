import {ModuleSymbol} from "@dawn/analysis/symbols/ModuleSymbol";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {ISymbol} from "@dawn/analysis/symbols/ISymbol";

export class SymbolResolver {

  resolve(symbolValue: Accessor, currentModule: ModuleSymbol): ISymbol | void {
    const symbol = currentModule.upwardsLookup(symbolValue.name);
    if (!symbol) {
      return;
    }

    if (symbolValue.subAccessor && symbol instanceof ModuleSymbol) {
      return this.drilldownResolve(symbolValue.subAccessor, symbol);
    }

    return symbol;
  }

  // A drilldown resolve is when we can only do downwards lookup from now on
  // For example, if we were to lookup a.b.c, and a contained b and c,
  // An normal resolve would find a, then find b, then find c by looking a from b
  // Obviously, this shouldn't be allowed, which is why downward lookups are implemented
  private drilldownResolve(symbolValue: Accessor, currentModule: ModuleSymbol): ISymbol | void {
    const symbol = currentModule.downwardsLookup(symbolValue.name);
    if (symbol instanceof ModuleSymbol && symbolValue.subAccessor) {
      return this.drilldownResolve(symbolValue.subAccessor, symbol);
    }

    if (symbol && !symbolValue.subAccessor) {
      return symbol;
    }
  }
}
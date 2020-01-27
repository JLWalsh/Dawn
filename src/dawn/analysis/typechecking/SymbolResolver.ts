import {SymbolScope} from "@dawn/analysis/symbol/SymbolScope";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {ISymbol, ISymbolVisibility} from "@dawn/analysis/symbol/ISymbol";

export namespace SymbolResolver {

  enum LookupDirection {
    UPWARDS,
    DOWNWARDS,
  }

  export function resolve(symbolName: Accessor, currentScope: SymbolScope, direction: LookupDirection = LookupDirection.UPWARDS): ISymbol | void {
    // If the symbol name has a subaccessor, then we must first locate the destination module
    if (symbolName.subAccessor) {
      const childScope = currentScope.childScopes.get(symbolName.name);
      if (childScope) {
        return resolve(symbolName.subAccessor, childScope, LookupDirection.DOWNWARDS);
      }

      if (currentScope.parent && direction === LookupDirection.UPWARDS) {
        return resolve(symbolName, currentScope.parent, direction);
      }

      return;
    }

    return resolveSymbol(symbolName.name, currentScope, direction);
  }

  function resolveSymbol(symbolName: string, currentScope: SymbolScope, direction: LookupDirection): ISymbol | void {
    const symbolFound = currentScope.symbols.get(symbolName);
    if (symbolFound) {
      const canResolveSymbol = !(symbolFound.getVisibility() === ISymbolVisibility.INTERNAL && direction === LookupDirection.DOWNWARDS);
      if (canResolveSymbol) {
        return symbolFound;
      }

      return;
    }

    if (direction === LookupDirection.UPWARDS && currentScope.parent) {
      return resolveSymbol(symbolName, currentScope.parent, direction);
    }
  }
}
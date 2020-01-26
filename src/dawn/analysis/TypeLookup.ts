import {Accessor} from "@dawn/lang/ast/Accessor";
import {Type, TypeVisibility} from "@dawn/analysis/types/Type";
import {Scope} from "@dawn/analysis/Scope";

export namespace TypeLookup {

  // Lookup direction affects what we can and can't return
  // For example, if a type is not exported and we are performing a downwards lookup upon the module containing that type
  // then we can't return that type (because the outside world has no access to that type).
  // However, if we are doing an upwards lookup on that type, we are allowed to resolve this type
  // (because we are inside that module).
  export enum LookupDirection {
    UPWARDS,
    DOWNWARDS
  }

  export function lookup(scope: Scope.ScopeData, typeName: Accessor, direction: LookupDirection = LookupDirection.UPWARDS): Type | void {
    // If we do not have any other subaccessors, then all we have to do is resolve that type
    if (!typeName.subAccessor) {
      return lookupType(scope, typeName.name, direction);
    }

    const childScope = scope.namedChildScopes.get(typeName.name);
    if (childScope) {
      return lookup(childScope, typeName.subAccessor, LookupDirection.DOWNWARDS);
    }

    if (scope.parent && direction === LookupDirection.UPWARDS) {
      return lookup(scope.parent, typeName, LookupDirection.UPWARDS);
    }
  }

  function lookupType(scope: Scope.ScopeData, typeName: string, direction: LookupDirection): Type | void {
    const typeFound = scope.types.get(typeName);
    if (typeFound && canResolveType(direction, typeFound)) {
      return typeFound;
    }

    if (scope.parent && direction === LookupDirection.UPWARDS) {
      return lookupType(scope, typeName, direction);
    }
  }

  function canResolveType(direction: LookupDirection, typeFound: Type): boolean {
    return !(direction === LookupDirection.DOWNWARDS  && typeFound.getVisibility() === TypeVisibility.INTERNAL);
  }
}


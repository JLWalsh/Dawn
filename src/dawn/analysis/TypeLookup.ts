import {Accessor} from "@dawn/lang/ast/Accessor";
import {Type} from "@dawn/analysis/types/Type";
import {ModuleType} from "@dawn/analysis/types/ModuleType";

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

  export function lookup(module: ModuleType, typeName: Accessor, direction: LookupDirection = LookupDirection.UPWARDS): Type | void {
    const typeFound = module.members.get(typeName.name);
    if (!typeFound) {
      if (module.parent && direction === LookupDirection.UPWARDS) {
        return lookup(module.parent, typeName, LookupDirection.UPWARDS);
      }

      return;
    }

    if (typeName.subAccessor) {
      if (typeFound.isModule()) {
        return lookup(typeFound, typeName.subAccessor, LookupDirection.DOWNWARDS);
      }

      return;
    }

    if (!canResolveType(direction, typeFound)) {
      return;
    }

    return typeFound;
  }

  function canResolveType(direction: LookupDirection, typeFound: Type): boolean {
    return !(direction === LookupDirection.DOWNWARDS  && !typeFound.isExported());
  }
}


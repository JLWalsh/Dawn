import {Type} from "@dawn/analysis/types/Type";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {NativeType, parseNativeTypeKeyword} from "@dawn/analysis/types/NativeType";
import {TypeLookup} from "@dawn/analysis/TypeLookup";
import {Types} from "@dawn/analysis/types/Types";
import {Scope} from "@dawn/analysis/Scope";

export namespace TypeReader {

  export function readType(typeName: Accessor, scopeTypeIsReferencedFrom: Scope.ScopeData): Type | void {
    return tryReadAsNativeType(typeName) || TypeLookup.lookup(scopeTypeIsReferencedFrom, typeName);
  }

  function tryReadAsNativeType(typeName: Accessor): NativeType | void {
    if (typeName.subAccessor) {
      return;
    }

    const nativeTypeKeyword = parseNativeTypeKeyword(typeName.name);
    if (!nativeTypeKeyword) {
      return;
    }

    return Types.newNativeType(nativeTypeKeyword);
  }
}
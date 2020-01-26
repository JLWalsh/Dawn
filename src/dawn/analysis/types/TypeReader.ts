import {Type} from "@dawn/analysis/types/Type";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {NativeType, parseNativeTypeKeyword} from "@dawn/analysis/types/NativeType";
import {TypeLookup} from "@dawn/analysis/TypeLookup";
import {ModuleType} from "@dawn/analysis/types/ModuleType";
import {Types} from "@dawn/analysis/types/Types";

export namespace TypeReader {

  export function readType(typeName: Accessor, moduleTypeNameIsIn: ModuleType): Type | void {
    return tryReadAsNativeType(typeName) || TypeLookup.lookup(moduleTypeNameIsIn, typeName);
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
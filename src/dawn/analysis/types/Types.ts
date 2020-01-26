import {ModuleType} from "@dawn/analysis/types/ModuleType";
import {ObjectType} from "@dawn/analysis/types/ObjectType";
import {Type, TypeVisibility} from "@dawn/analysis/types/Type";
import {NativeType, NativeTypeKeyword} from "@dawn/analysis/types/NativeType";

export namespace Types {

  export function areSame(expectedType: Type, currentType: Type): boolean {

  }

  export function areEquatable(leftType: Type, rightType: Type) {
    return false;
  }

  export function display(type: Type): string {

  }

  export function newObjectType(visibility: TypeVisibility): ObjectType {
    return {
      getVisibility() {
        return visibility;
      },
      isModule() {
        return false;
      },
      isObject() {
        return true;
      },
      isNative() {
        return false;
      },
    };
  }

  export function newNativeType(value: NativeTypeKeyword): NativeType {
    return {
      value,
      getVisibility() {
        return TypeVisibility.INTERNAL;
      },
      isModule() {
        return false;
      },
      isObject() {
        return false;
      },
      isNative() {
        return true;
      },
      isReferable(): boolean {

      }
    };
  }

}
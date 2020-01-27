import {Type} from "@dawn/analysis/typechecking/types/Type";

export namespace TypeQuery {

  export function areSame(left: Type, right: Type): boolean {
    if (left.isAny() || right.isAny()) {
      return true;
    }

    if (left.isObject() && right.isObject()) {
      // If the type instance is the same, then we know that we're dealing with the same type
      return left === right;
    }

    if (left.isNative() && right.isNative()) {
      return left.isSameAs(right);
    }

    return false;
  }
}
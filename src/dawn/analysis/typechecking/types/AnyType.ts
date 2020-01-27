import {Type} from "@dawn/analysis/typechecking/types/Type";

export class AnyType implements Type {
  isAny() {
    return true;
  }

  isObject() {
    return false;
  }

  isNative() {
    return false;
  }
}
import {Type} from "@dawn/analysis/typechecking/types/Type";

export class ObjectType implements Type {

  constructor(
    private readonly keyValues: Map<string, Type> = new Map(),
  ) {}

  hasTypeFor(key: string): boolean {
    return this.keyValues.has(key);
  }

  define(key: string, type: Type) {
    this.keyValues.set(key, type);
  }

  isAny() {
    return false;
  }

  isObject() {
    return true;
  }
}
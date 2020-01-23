import {ModuleType} from "@dawn/analysis/types/ModuleType";
import {ObjectType} from "@dawn/analysis/types/ObjectType";
import {TypeVisibility} from "@dawn/analysis/types/Type";

export namespace Types {

  export function newModuleType(visibility: TypeVisibility, parent?: ModuleType): ModuleType {
    return {
      getVisibility() {
        return visibility;
      },
      isModule() {
        return true;
      },
      isObject(): boolean {
        return false;
      },
      members: new Map(),
      parent,
    };
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
    };
  }
}
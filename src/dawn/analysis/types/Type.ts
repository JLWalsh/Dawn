import {ModuleType} from "@dawn/analysis/types/ModuleType";
import {ObjectType} from "@dawn/analysis/types/ObjectType";

export interface Type {
  isModule(): this is ModuleType;
  isObject(): this is ObjectType;
  getVisibility(): TypeVisibility;
}

export enum TypeVisibility {
  INTERNAL,
  EXPORTED
}
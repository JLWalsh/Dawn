import {ObjectType} from "@dawn/analysis/types/ObjectType";
import {NativeType} from "@dawn/analysis/types/NativeType";

export interface Type {
  isObject(): this is ObjectType;
  isNative(): this is NativeType;

  getVisibility(): TypeVisibility;
}

export enum TypeVisibility {
  INTERNAL,
  EXPORTED
}
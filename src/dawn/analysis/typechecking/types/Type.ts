import {AnyType} from "@dawn/analysis/typechecking/types/AnyType";
import {ObjectType} from "@dawn/analysis/typechecking/types/ObjectType";
import {NativeType} from "@dawn/analysis/typechecking/types/NativeType";

export interface Type {
  isAny(): this is AnyType;
  isObject(): this is ObjectType;
  isNative(): this is NativeType;
}
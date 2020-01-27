import {AnyType} from "@dawn/analysis/typechecking/types/AnyType";
import {ObjectType} from "@dawn/analysis/typechecking/types/ObjectType";

export interface Type {
  isAny(): this is AnyType;
  isObject(): this is ObjectType;
}
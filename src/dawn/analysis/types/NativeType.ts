import {Type} from "@dawn/analysis/types/Type";
import {Keyword} from "@dawn/lang/Keyword";

export interface NativeType extends Type {
  value: Keyword;
}

export type NativeTypeKeyword = Keyword.VOID | Keyword.BOOLEAN;

export function parseNativeTypeKeyword(keyword: string): NativeTypeKeyword | void {
  if (keyword === Keyword.VOID) {
    return Keyword.VOID;
  }

}


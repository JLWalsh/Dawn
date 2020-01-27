import {Type} from "@dawn/analysis/typechecking/types/Type";
import {Keyword} from "@dawn/lang/Keyword";

export class NativeType implements Type {

  public static readonly SupportedTypes: Set<Keyword> = new Set([
    Keyword.INT, Keyword.FLOAT, Keyword.BOOLEAN, Keyword.VOID
  ]);

  constructor(
    private readonly keyword: Keyword,
  ) {}

  isAny() {
    return false;
  }

  isObject() {
    return false;
  }

  isNative() {
    return true;
  }
}

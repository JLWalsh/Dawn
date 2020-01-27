import {Type} from "@dawn/analysis/typechecking/types/Type";
import {Keyword} from "@dawn/lang/Keyword";

export class NativeType implements Type {

  public static readonly SupportedTypes: Set<Keyword> = new Set([
    Keyword.INT, Keyword.FLOAT, Keyword.BOOLEAN, Keyword.VOID
  ]);

  constructor(
    private readonly keyword: Keyword,
  ) {}

  isSameAs(other: NativeType): boolean {
    return this.keyword === other.keyword;
  }

  isAny() {
    return false;
  }

  isObject() {
    return false;
  }

  isNative() {
    return true;
  }

  describe(): string {
    return `(native) ${this.keyword}`;
  }
}

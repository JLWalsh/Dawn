import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
import {Types} from "@dawn/typechecking/Types";

export class TypeContext {

  constructor(
    private readonly expandedTypes: Map<ISymbol, Types.Type> = new Map(),
  ) {}

  hasTypeFor(symbol: ISymbol): boolean {
    return this.expandedTypes.has(symbol);
  }

  defineType(mappedSymbol: ISymbol, type: Types.Type) {
    if (this.hasTypeFor(mappedSymbol)) {
      throw new Error(`A type already exists for ${mappedSymbol.getName()}`);
    }

    this.expandedTypes.set(mappedSymbol, type);
  }
}

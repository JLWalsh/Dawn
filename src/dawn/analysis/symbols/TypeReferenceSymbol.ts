import {ISymbol, SymbolVisibility} from "@dawn/analysis/symbols/ISymbol";

export class TypeReferenceSymbol implements ISymbol {

  constructor(
    private readonly referencedType: string,
    public readonly visibility: SymbolVisibility = SymbolVisibility.INTERNAL,
  ) {}


}
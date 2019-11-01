import {ISymbol, SymbolVisibility} from "@dawn/analysis/symbols/ISymbol";

export class ConstantSymbol implements ISymbol {

  constructor(
    public readonly visibility: SymbolVisibility,
    private readonly name: string,
  ) {}
}
import {ISymbol, SymbolVisibility} from "@dawn/analysis/symbols/ISymbol";
import {ObjectValue} from "@dawn/lang/ast/declarations/ObjectDeclaration";

export class ObjectDeclarationSymbol implements ISymbol {

  constructor(
    public readonly visibility: SymbolVisibility,
    private readonly name: string,
    private readonly values: ObjectValue[],
  ) {}
}
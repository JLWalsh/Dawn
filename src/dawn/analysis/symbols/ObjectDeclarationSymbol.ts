import {ISymbol, SymbolVisibility} from "@dawn/analysis/symbols/ISymbol";
import {ObjectDeclaration} from "@dawn/lang/ast/declarations/ObjectDeclaration";

export class ObjectDeclarationSymbol implements ISymbol {

  constructor(
    public readonly visibility: SymbolVisibility,
    public readonly name: string,
    public readonly node: ObjectDeclaration,
  ) {}
}

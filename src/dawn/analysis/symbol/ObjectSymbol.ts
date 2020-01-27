import {ISymbol, ISymbolVisibility} from "@dawn/analysis/symbol/ISymbol";
import {ObjectDeclaration} from "@dawn/lang/ast/declarations/ObjectDeclaration";

export class ObjectSymbol implements ISymbol {

  constructor(
    private readonly object: ObjectDeclaration,
    private readonly visibility: ISymbolVisibility,
  ) {}

  getName(): string {
    return this.object.name;
  }

  getVisibility(): ISymbolVisibility {
    return this.visibility;
  }

}
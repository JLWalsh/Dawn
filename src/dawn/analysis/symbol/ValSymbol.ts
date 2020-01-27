import {ISymbol, ISymbolVisibility} from "@dawn/analysis/symbol/ISymbol";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";

export class ValSymbol implements ISymbol {

  constructor(
    private readonly visibility: ISymbolVisibility,
    private readonly val: ValDeclaration,
  ) {}

  getName(): string {
    return this.val.name;
  }

  getVisibility(): ISymbolVisibility {
    return this.visibility;
  }

}
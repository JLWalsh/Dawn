import {ISymbol, ISymbolVisibility} from "@dawn/analysis/symbol/ISymbol";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";

export class FunctionSymbol implements ISymbol {

  constructor(
    private readonly visibility: ISymbolVisibility,
    private readonly func: FunctionDeclaration,
  ) {}

  getName(): string {
    return this.func.name;
  }

  getVisibility(): ISymbolVisibility {
    return this.visibility;
  }

}
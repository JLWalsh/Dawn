import {ISymbol, ISymbolVisibility} from "@dawn/analysis/symbols/ISymbol";
import {Scope} from "@dawn/analysis/Scope";

export class ModuleSymbol implements ISymbol {

  constructor(
    private readonly name: string,
    private readonly scope: Scope = new Scope(),
  ) {}

  getName(): string {
    return this.name;
  }

  getScope() {
    return this.scope;
  }

  isVisibility(visibility: ISymbolVisibility): boolean {
    return visibility === ISymbolVisibility.INTERNAL;
  }

}


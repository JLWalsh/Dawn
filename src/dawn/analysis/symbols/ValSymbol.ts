import {ISymbol, ISymbolVisibility} from "@dawn/analysis/symbols/ISymbol";
import {Scope} from "@dawn/analysis/Scope";

export class ValSymbol implements ISymbol {

  constructor(
    private readonly name: string,
  ) {}

  getName(): string {
    return this.name;
  }

  isVisibility(visibility: ISymbolVisibility): boolean {
    return visibility === ISymbolVisibility.INTERNAL;
  }

  getScope(): Scope | void {
    return undefined;
  }
}

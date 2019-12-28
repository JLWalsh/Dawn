import {ISymbol, ISymbolVisibility} from "@dawn/analysis/symbols/ISymbol";
import {Accessor} from "@dawn/lang/ast/Accessor";

export class ObjectSymbol implements ISymbol {

  constructor(
    private readonly name: string,
    private readonly vals: ObjectSymbolValue[],
  ) {}

  getName(): string {
    return this.name;
  }

  values() {
    return this.vals;
  }

  isVisibility(visibility: ISymbolVisibility): boolean {
    return visibility === ISymbolVisibility.INTERNAL;
  }
}

export class ObjectSymbolValue {

  constructor(
    private readonly name: string,
    private readonly type: Accessor,
  ) {}

  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }
}


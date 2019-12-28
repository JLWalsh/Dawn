import {ISymbol, ISymbolVisibility} from "@dawn/analysis/symbols/ISymbol";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {Scope} from "@dawn/analysis/Scope";

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

  getScope(): Scope | void {
    return undefined;
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


import {ISymbol, ISymbolVisibility} from "@dawn/analysis/symbols/ISymbol";
import {FunctionArgument} from "@dawn/lang/ast/declarations/FunctionArgument";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {Scope} from "@dawn/analysis/scopes/Scope";

export class FunctionSymbol implements ISymbol {

  private readonly implementations: FunctionSymbolPrototype[] = [];

  constructor(
    private readonly name: string,
  ) {}

  addPrototype(prototype: FunctionSymbolPrototype) {
    this.implementations.push(prototype);
  }

  prototypes() {
    return this.implementations;
  }

  getName(): string {
    return this.name;
  }

  hasPrototype(prototype: FunctionSymbolPrototype): boolean {
    return this.implementations.some(otherPrototype => otherPrototype.is(prototype));
  }

  isVisibility(visibility: ISymbolVisibility): boolean {
    return visibility === ISymbolVisibility.INTERNAL;
  }

  getScope(): Scope | void {
    return undefined;
  }
}

export class FunctionSymbolPrototype {

  constructor(
    private readonly returnType: Accessor | null,
    private readonly args: FunctionArgument[],
    private readonly variableScope: Scope = new Scope(),
  ) {}

  getArgs() {
    return this.args;
  }

  getReturnType() {
    return this.returnType;
  }

  getScope() {
    return this.variableScope;
  }

  is(prototype: FunctionSymbolPrototype): boolean {
    if (this.returnType !== prototype.returnType) {
      return false;
    }

    if (this.args.length !== prototype.args.length) {
      return false;
    }

    return this.args.every((arg, index) => arg.valueType === prototype.args[index].valueType);
  }
}

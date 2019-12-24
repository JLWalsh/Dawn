import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
import {FunctionArgument} from "@dawn/lang/ast/declarations/FunctionArgument";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {FunctionScope} from "@dawn/analysis/scopes/FunctionScope";

export interface FunctionSymbolPrototype {
  returnType: Accessor | null;
  args: FunctionArgument[];
  mainScope: FunctionScope;
}

export class FunctionSymbol implements ISymbol {

  private readonly prototypes: FunctionSymbolPrototype[] = [];

  constructor(
    private readonly name: string,
  ) {}

  addPrototype(args: FunctionArgument[], returnType: Accessor | null, mainScope: FunctionScope) {
    this.prototypes.push({ args, returnType, mainScope });
  }

  getName(): string {
    return this.name;
  }

}

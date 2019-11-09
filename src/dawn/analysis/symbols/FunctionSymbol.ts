import {ISymbol, SymbolVisibility} from "@dawn/analysis/symbols/ISymbol";
import {FunctionArgument} from "@dawn/lang/ast/declarations/FunctionArgument";
import {Accessor} from "@dawn/lang/ast/Accessor";

export interface FunctionSymbolPrototype {
  returnType: Accessor | null;
  args: FunctionArgument[];
}

export class FunctionSymbol implements ISymbol {

  private readonly prototypes: FunctionSymbolPrototype[] = [];

  constructor(
    public readonly visibility: SymbolVisibility,
    public readonly name: string,
  ) {}

  definePrototype(args: FunctionArgument[], returnType: Accessor | null) {
    this.prototypes.push({ args, returnType });
  }

}

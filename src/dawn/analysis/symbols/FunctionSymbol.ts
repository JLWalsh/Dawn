import {ISymbol, SymbolVisibility} from "@dawn/analysis/symbols/ISymbol";
import {FunctionArgument} from "@dawn/lang/ast/declarations/FunctionArgument";

export interface FunctionSymbolPrototype {
  returnType: string | null;
  args: FunctionArgument[];
}

export class FunctionSymbol implements ISymbol {

  private readonly prototypes: FunctionSymbolPrototype[] = [];

  constructor(
    public readonly visibility: SymbolVisibility,
    public readonly name: string,
  ) {}

  definePrototype(args: FunctionArgument[], returnType: string | null) {
    this.prototypes.push({ args, returnType });
  }

}

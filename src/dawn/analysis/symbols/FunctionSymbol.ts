import {ConstantSymbol} from "@dawn/analysis/symbols/ConstantSymbol";

export interface FunctionSymbolPrototype {
  args: ConstantSymbol[];
}

export class FunctionSymbol extends ConstantSymbol {

  constructor(
    private readonly returnType: ConstantSymbol,
    private readonly implementations: FunctionSymbolPrototype[],
    name: string,
    containedIn: ConstantSymbol | void = undefined,
  ) {
    super(name, containedIn);
  }

}

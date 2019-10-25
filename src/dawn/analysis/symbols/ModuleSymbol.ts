import {ConstantSymbol} from "@dawn/analysis/symbols/ConstantSymbol";

export class ModuleSymbol extends ConstantSymbol {

  constructor(
    private readonly exportedSymbols: ConstantSymbol[],
    private readonly internalSymbols: ConstantSymbol[],
    name: string,
    containedIn: ConstantSymbol | void = undefined,
  ) {
    super(name, containedIn);
  }

}

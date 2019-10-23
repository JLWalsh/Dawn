import {ConstantSymbol} from "@dawn/analysis/symbols/ConstantSymbol";

export class VariableSymbol extends ConstantSymbol {

  constructor(
    private readonly type: ConstantSymbol,
    name: string,
    containedIn: ConstantSymbol | void = undefined,
  ) {
    super(name, containedIn);
  }

}

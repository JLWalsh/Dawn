import {ConstantSymbol} from "@dawn/analysis/symbols/ConstantSymbol";
import {VariableSymbol} from "@dawn/analysis/symbols/VariableSymbol";

export class ObjectSymbol extends ConstantSymbol {

  constructor(
    private readonly values: VariableSymbol[],
    name: string,
    containedIn: ConstantSymbol | void = undefined,
  ) {
    super(name, containedIn);
  }

}

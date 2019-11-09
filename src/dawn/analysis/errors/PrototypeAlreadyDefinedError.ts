import {FunctionSymbolPrototype} from "@dawn/analysis/symbols/FunctionSymbol";

export class PrototypeAlreadyDefinedError extends Error {

  constructor(public readonly existingPrototype: FunctionSymbolPrototype) {
    super();
  }
}

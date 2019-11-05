import {ISymbol} from "@dawn/analysis/symbols/ISymbol";

export class SymbolAlreadyDefinedError extends Error {
  constructor(public readonly existingSymbol: ISymbol, public readonly newSymbol: ISymbol) {
    super();
  }
}

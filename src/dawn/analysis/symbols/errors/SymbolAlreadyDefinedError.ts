import {ISymbol} from "@dawn/analysis/symbols/ISymbol";

export class SymbolAlreadyDefinedError extends Error {
  constructor(private readonly existingSymbol: ISymbol) {
    super();
  }
}
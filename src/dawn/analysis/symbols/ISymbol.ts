
export enum SymbolVisibility {
  EXPORTED,
  INTERNAL
}

export interface ISymbol {
  visibility: SymbolVisibility;
  name: string;
}

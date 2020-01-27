
export interface ISymbol {
  getName(): string;
  getVisibility(): ISymbolVisibility;
}

export enum ISymbolVisibility {
  INTERNAL,
  EXPORTED
}
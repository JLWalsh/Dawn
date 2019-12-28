import {Scope} from "@dawn/analysis/Scope";

export enum ISymbolVisibility {
  INTERNAL,
  EXPORTED
}

export interface ISymbol {
  getName(): string;
  getScope(): Scope | void;
  isVisibility(visibility: ISymbolVisibility): boolean;
}

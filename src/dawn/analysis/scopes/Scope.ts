import {ISymbol} from "@dawn/analysis/symbols/ISymbol";

export interface Scope {
  getChildren(): Scope[];
  addSymbol(symbol: ISymbol): void;
  getSymbol(name: string): ISymbol | void;
}

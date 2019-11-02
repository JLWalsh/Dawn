import {AstNode} from "@dawn/lang/ast/AstNode";

export enum SymbolVisibility {
  EXPORTED,
  INTERNAL
}

export interface ISymbol {
  visibility: SymbolVisibility;
  name: string;
  node?: AstNode;
}

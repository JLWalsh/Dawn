import {AstNode} from "@dawn/lang/ast/AstNode";

export enum SymbolVisibility {
  EXPORTED = "exported",
  INTERNAL = "internal"
}

export interface ISymbol {
  visibility: SymbolVisibility;
  name: string;
  node?: AstNode;
}

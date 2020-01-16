import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
import {AstNode} from "@dawn/lang/ast/AstNode";

export class SymbolAnnotator {

  constructor(
    private readonly annotatedNodes: Map<AstNode, ISymbol> = new Map(),
  ) {}

  annotateNode(node: AstNode, symbol: ISymbol) {
    if (this.annotatedNodes.has(node)) {
      throw new Error('Node has already been annotated');
    }

    this.annotatedNodes.set(node, symbol);
  }

  findAnnotatedSymbol(node: AstNode): ISymbol | void {
    return this.annotatedNodes.get(node);
  }
}
import {AstNode} from "@dawn/lang/ast/AstNode";
import {AstNodeVisitor} from "@dawn/lang/ast/AstNodeVisitor";

export class Block implements AstNode {

  constructor(
    public readonly statements: AstNode[]
  ) {}

  accept(visitor: AstNodeVisitor): void {
    visitor.visitBlock(this);
  }
}
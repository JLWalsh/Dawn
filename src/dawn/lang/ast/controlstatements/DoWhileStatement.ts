import {AstNode} from "@dawn/lang/ast/AstNode";
import {Block} from "@dawn/lang/ast/Block";
import {Statement} from "@dawn/lang/ast/Statement";
import {AstNodeVisitor} from "@dawn/lang/ast/AstNodeVisitor";

export class DoWhileStatement implements AstNode {

  constructor(
    private readonly statement: Block,
    private readonly condition: Statement,
  ) {}

  accept(visitor: AstNodeVisitor): void {
    visitor.visitDoWhileStatement(this);
  }

}
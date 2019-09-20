import {AstNode} from "@dawn/lang/ast/AstNode";
import {Block} from "@dawn/lang/ast/Block";
import {Statement} from "@dawn/lang/ast/Statement";
import {AstNodeVisitor} from "@dawn/lang/ast/AstNodeVisitor";

export class WhileStatement implements AstNode {

  constructor(
    private readonly condition: Statement,
    private readonly statement: Block,
  ) {}

  accept(visitor: AstNodeVisitor): void {
    visitor.visitWhileStatement(this);
  }

}
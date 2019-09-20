import {AstNode} from "@dawn/lang/ast/AstNode";
import {Block} from "@dawn/lang/ast/Block";
import {Optional} from "@dawn/util/Optional";
import {Statement} from "@dawn/lang/ast/Statement";
import {AstNodeVisitor} from "@dawn/lang/ast/AstNodeVisitor";

export class IfStatement implements AstNode {

  constructor(
    public readonly condition: Statement,
    public readonly thenStatement: Block,
    public readonly elseStatement: Optional<Block>,
  ) {}

  accept(visitor: AstNodeVisitor): void {
    visitor.visitIfStatement(this);
  }

}
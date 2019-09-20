import {AstNode} from "@dawn/lang/ast/AstNode";
import {Optional} from "@dawn/util/Optional";
import {Statement} from "@dawn/lang/ast/Statement";
import {Block} from "@dawn/lang/ast/Block";
import {AstNodeVisitor} from "@dawn/lang/ast/AstNodeVisitor";

export class ForStatement implements AstNode {

  constructor(
    private readonly initializer: Optional<Statement>,
    private readonly condition: Optional<Statement>,
    private readonly incrementation: Optional<Statement>,
    private readonly statement: Block,
  ) {}

  accept(visitor: AstNodeVisitor): void {
    visitor.visitForStatement(this);
  }
}
import {Statement} from "@dawn/lang/ast/Statement";
import {Type} from "@dawn/lang/Type";
import {AstNodeVisitor} from "@dawn/lang/ast/AstNodeVisitor";

export class ReturnExpression extends Statement {

  constructor(
    public readonly value: number,
    type: Type,
  ) {
    super(type);
  }

  accept(visitor: AstNodeVisitor): void {
    visitor.visitReturnExpression(this);
  }
}
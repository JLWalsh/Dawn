import {Statement} from "@dawn/lang/ast/Statement";
import {Type} from "@dawn/lang/Type";
import {AstNodeVisitor} from "@dawn/lang/ast/AstNodeVisitor";

export class ConstantStatement extends Statement {

  constructor(public readonly value: any, type: Type) {
    super(type);
  }

  accept(visitor: AstNodeVisitor): void {
    visitor.visitConstantStatement(this);
  }
}
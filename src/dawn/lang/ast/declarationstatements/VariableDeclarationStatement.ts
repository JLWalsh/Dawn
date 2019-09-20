import {Statement} from "../Statement";
import {Type} from "@dawn/lang/Type";
import {AstNodeVisitor} from "@dawn/lang/ast/AstNodeVisitor";

export class VariableDeclarationStatement extends Statement {

  constructor(type: Type) {
    super(type);
  }

  accept(visitor: AstNodeVisitor): void {
    visitor.visitVariableDeclarationStatement(this);
  }

}
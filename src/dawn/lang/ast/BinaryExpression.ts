import {Token} from "../Token";
import {Statement} from "@dawn/lang/ast/Statement";
import {Type} from "@dawn/lang/Type";
import {AstNodeVisitor} from "@dawn/lang/ast/AstNodeVisitor";

export class BinaryExpression extends Statement {

  constructor(
    private readonly leftHand: Statement,
    private readonly operator: Token,
    private readonly rightHand: Statement,
    type: Type,
  ) {
    super(type);
  }

  accept(visitor: AstNodeVisitor): void {
    visitor.visitBinaryExpression(this);
  }

}
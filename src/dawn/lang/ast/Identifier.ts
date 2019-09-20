import {AstNode} from "@dawn/lang/ast/AstNode";
import {AstNodeVisitor} from "@dawn/lang/ast/AstNodeVisitor";

export class Identifier implements AstNode {

  constructor(public readonly name: string) {}

  accept(visitor: AstNodeVisitor): void {
  }

}
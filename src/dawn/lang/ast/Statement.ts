import {AstNode} from "@dawn/lang/ast/AstNode";
import {Type} from "@dawn/lang/Type";
import {AstNodeVisitor} from "@dawn/lang/ast/AstNodeVisitor";

export abstract class Statement implements AstNode {

  protected constructor(
    public readonly type: Type,
  ) {}

  abstract accept(visitor: AstNodeVisitor): void;
}


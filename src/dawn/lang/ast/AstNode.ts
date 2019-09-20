import {AstNodeVisitor} from "@dawn/lang/ast/AstNodeVisitor";

export interface AstNode {
  accept(visitor: AstNodeVisitor): void;
}
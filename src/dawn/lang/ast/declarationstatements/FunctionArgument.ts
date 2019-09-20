import {AstNode} from "@dawn/lang/ast/AstNode";
import {AstNodeVisitor} from "@dawn/lang/ast/AstNodeVisitor";
import {Type} from "@dawn/lang/Type";

enum ArgumentType {
  SINGLE, // (arg: int)
  COLLECT_REMAINING, // (...args: int[])
}

export class FunctionArgument implements AstNode {

  static readonly Type = ArgumentType

  constructor(
    public readonly name: string,
    public readonly type: Type,
  ) {}

  accept(visitor: AstNodeVisitor): void {
  }
}
import {Statement} from "@dawn/lang/ast/Statement";
import {AstNodeVisitor} from "@dawn/lang/ast/AstNodeVisitor";
import {Block} from "@dawn/lang/ast/Block";
import {FunctionArgument} from "@dawn/lang/ast/declarationstatements/FunctionArgument";
import {Type} from "@dawn/lang/Type";

export class FunctionDeclaration extends Statement {

  constructor(
    public readonly name: string,
    public readonly args: FunctionArgument[],
    public readonly body: Block,
  ) {
    super(Type.DefaultTypes.function);
  }

  accept(visitor: AstNodeVisitor): void {
  }

}
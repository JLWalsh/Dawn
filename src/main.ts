import 'module-alias/register';
import {Type} from "@dawn/lang/Type";
import {ConstantStatement} from "@dawn/lang/ast/declarationstatements/ConstantStatement";
import {IfStatement} from "@dawn/lang/ast/controlstatements/IfStatement";
import {Block} from "@dawn/lang/ast/Block";
import {ReturnExpression} from "@dawn/lang/ast/ReturnExpression";
import {AstNodeVisitor} from "@dawn/lang/ast/AstNodeVisitor";
import {DoWhileStatement} from "@dawn/lang/ast/controlstatements/DoWhileStatement";
import {ForStatement} from "@dawn/lang/ast/controlstatements/ForStatement";
import {WhileStatement} from "@dawn/lang/ast/controlstatements/WhileStatement";
import {VariableDeclarationStatement} from "@dawn/lang/ast/declarationstatements/VariableDeclarationStatement";
import {BinaryExpression} from "@dawn/lang/ast/BinaryExpression";

const int = Type.named("int");
const boolean = Type.named("boolean");

const trueConstant = new ConstantStatement(true, boolean);

const returnTenBlock = new Block([new ReturnExpression(10, int)]);
const ifStatement = new IfStatement(trueConstant, returnTenBlock);
const returnTwentyBlock = new Block([new ReturnExpression(20, int)]);

const program = new Block([
  ifStatement,
  returnTwentyBlock,
]);

let indentation = 0;
let indentString = " ";
const print = (value: string) => console.warn(indentString.repeat(indentation) + value);

const indent = () => indentation++;
const unindent = () => indentation--;

const visitor: AstNodeVisitor = new class X implements AstNodeVisitor {
  visitDoWhileStatement(doWhileStatement: DoWhileStatement): void {
  }

  visitForStatement(forStatement: ForStatement): void {

  }

  visitIfStatement(ifStatement: IfStatement): void {
    print(`if (`);
    ifStatement.condition.accept(this);
    print(') {');
    indent();

    ifStatement.thenStatement.accept(this);

    if (ifStatement.elseStatement) {
      print('} else {');
      ifStatement.elseStatement.accept(this);
    }

    unindent();
    print('}');
  }

  visitWhileStatement(whileStatement: WhileStatement): void {

  }

  visitConstantStatement(constantStatement: ConstantStatement): void {
    print(`${constantStatement.value} ${constantStatement.type.name}`);
  }

  visitVariableDeclarationStatement(variableDeclarationStatement: VariableDeclarationStatement): void {

  }

  visitBinaryExpression(expression: BinaryExpression): void {

  }

  visitBlock(block: Block): void {
    print("{");
      indent();
      block.statements.forEach(statement => statement.accept(this));
      unindent();
    print("}")
  }

  visitReturnExpression(returnExpression: ReturnExpression): void {
    print(`return ${returnExpression.value}`)
  }
};

visitor.visitBlock(program);

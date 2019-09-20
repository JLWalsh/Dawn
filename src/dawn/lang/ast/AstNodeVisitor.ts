import {BinaryExpression} from "./BinaryExpression";
import {ReturnExpression} from "@dawn/lang/ast/ReturnExpression";
import {IfStatement} from "@dawn/lang/ast/controlstatements/IfStatement";
import {DoWhileStatement} from "@dawn/lang/ast/controlstatements/DoWhileStatement";
import {ForStatement} from "@dawn/lang/ast/controlstatements/ForStatement";
import {WhileStatement} from "@dawn/lang/ast/controlstatements/WhileStatement";
import {ConstantStatement} from "@dawn/lang/ast/declarationstatements/ConstantStatement";
import {VariableDeclarationStatement} from "@dawn/lang/ast/declarationstatements/VariableDeclarationStatement";
import {Block} from "@dawn/lang/ast/Block";

export interface AstNodeVisitor  {
  visitDoWhileStatement(doWhileStatement: DoWhileStatement): void;
  visitForStatement(forStatement: ForStatement): void;
  visitIfStatement(ifStatement: IfStatement): void;
  visitWhileStatement(whileStatement: WhileStatement): void;

  visitConstantStatement(constantStatement: ConstantStatement): void;
  visitVariableDeclarationStatement(variableDeclarationStatement: VariableDeclarationStatement): void;

  visitBinaryExpression(expression: BinaryExpression): void;
  visitBlock(block: Block): void;
  visitReturnExpression(returnExpression: ReturnExpression): void;
}
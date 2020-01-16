import {Program} from "@dawn/lang/ast/Program";
import {DeclarationVisitor} from "@dawn/lang/ast/DeclarationNode";
import {StatementVisitor} from "@dawn/lang/ast/Statement";
import {Expression, ExpressionVisitor} from "@dawn/lang/ast/Expression";
import {BinaryExpression} from "@dawn/lang/ast/expressions/BinaryExpression";
import {ComparisonExpression} from "@dawn/lang/ast/expressions/ComparisonExpression";
import {EqualityExpression} from "@dawn/lang/ast/expressions/EqualityExpression";
import {Export} from "@dawn/lang/ast/Export";
import {ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {Literal} from "@dawn/lang/ast/Literal";
import {Instantiation} from "@dawn/lang/ast/Instantiation";
import {Import} from "@dawn/lang/ast/Import";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";
import {ValAccessor} from "@dawn/lang/ast/ValAccessor";
import {UnaryExpression} from "@dawn/lang/ast/expressions/UnaryExpression";
import {Return} from "@dawn/lang/ast/Return";
import {ObjectDeclaration} from "@dawn/lang/ast/declarations/ObjectDeclaration";

export class SymbolParser2 {

  parseAllIn(program: Program) {

  }
}

class SymbolParser2Visitor implements DeclarationVisitor<void>, StatementVisitor<void>, ExpressionVisitor<void> {

  constructor(
    private readonly symbolParser: SymbolParser2,
  ) {}

  visitBinary(b: BinaryExpression): void {
    return undefined;
  }

  visitComparison(c: ComparisonExpression): void {
    return undefined;
  }

  visitEquality(e: EqualityExpression): void {
    return undefined;
  }

  visitExport(e: Export): void {
    return undefined;
  }

  visitExpressionStatement(e: Expression): void {
    return undefined;
  }

  visitFunctionDeclaration(f: FunctionDeclaration): void {
    return undefined;
  }

  visitImport(i: Import): void {
    return undefined;
  }

  visitInstantiation(i: Instantiation): void {
    return undefined;
  }

  visitLiteral(l: Literal): void {
    return undefined;
  }

  visitModuleDeclaration(m: ModuleDeclaration): void {
    return undefined;
  }

  visitObjectDeclaration(o: ObjectDeclaration): void {
    return undefined;
  }

  visitReturn(r: Return): void {
    return undefined;
  }

  visitUnary(u: UnaryExpression): void {
    return undefined;
  }

  visitValAccessor(v: ValAccessor): void {
    return undefined;
  }

  visitValDeclaration(v: ValDeclaration): void {
    return undefined;
  }
}
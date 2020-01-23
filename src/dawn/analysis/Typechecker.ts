import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
import {Program} from "@dawn/lang/ast/Program";
import {TypeParser} from "@dawn/analysis/TypeParser";
import {DeclarationVisitor} from "@dawn/lang/ast/DeclarationNode";
import {Export} from "@dawn/lang/ast/Export";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";
import {Import} from "@dawn/lang/ast/Import";
import {ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {ObjectDeclaration} from "@dawn/lang/ast/declarations/ObjectDeclaration";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";
import {StatementVisitor} from "@dawn/lang/ast/Statement";
import {Expression, ExpressionVisitor} from "@dawn/lang/ast/Expression";
import {ValAccessor} from "@dawn/lang/ast/ValAccessor";
import {EqualityExpression} from "@dawn/lang/ast/expressions/EqualityExpression";
import {ComparisonExpression} from "@dawn/lang/ast/expressions/ComparisonExpression";
import {Instantiation} from "@dawn/lang/ast/Instantiation";
import {BinaryExpression} from "@dawn/lang/ast/expressions/BinaryExpression";
import {Literal} from "@dawn/lang/ast/Literal";
import {Return} from "@dawn/lang/ast/Return";
import {UnaryExpression} from "@dawn/lang/ast/expressions/UnaryExpression";

export namespace Typechecker {

  import ProgramTypes = TypeParser.ProgramTypes;

  export function typecheck(program: Program, programTypes: ProgramTypes, diagnostics: DiagnosticReporter) {

  }

  class TypecheckerVisitor implements DeclarationVisitor<void>, StatementVisitor<void>, ExpressionVisitor<void> {

    constructor(
      private readonly diagnostics: DiagnosticReporter,
    ) {}

    typecheck(program: Program, types: ProgramTypes) {

    }

    visitFunctionDeclaration(f: FunctionDeclaration): void {

    }

    visitModuleDeclaration(m: ModuleDeclaration): void {
      return undefined;
    }

    visitValDeclaration(v: ValDeclaration): void {
      return undefined;
    }

    visitBinary(b: BinaryExpression): void {
      return undefined;
    }

    visitComparison(c: ComparisonExpression): void {
      return undefined;
    }

    visitEquality(e: EqualityExpression): void {
      return undefined;
    }

    visitExpressionStatement(e: Expression): void {
      return undefined;
    }

    visitInstantiation(i: Instantiation): void {
      return undefined;
    }

    visitLiteral(l: Literal): void {
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

    // Not needed
    visitExport(e: Export): void {}
    visitImport(i: Import): void {}
    visitObjectDeclaration(o: ObjectDeclaration): void {}
  }
}
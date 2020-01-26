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
import {Return} from "@dawn/lang/ast/Return";
import {ModuleType} from "@dawn/analysis/types/ModuleType";
import {DiagnosticSeverity} from "@dawn/ui/Diagnostic";
import {TypeReader} from "@dawn/analysis/types/TypeReader";
import {Accessor, describeAccessor} from "@dawn/lang/ast/Accessor";
import {ExpressionType, Type} from "@dawn/analysis/types/Type";
import {Keyword} from "@dawn/lang/Keyword";
import {Types} from "@dawn/analysis/types/Types";
import {Scopes} from "@dawn/analysis/Scope";
import {VariableAlreadyDefinedError} from "@dawn/analysis/errors/VariableAlreadyDefinedError";
import {EqualityExpression} from "@dawn/lang/ast/expressions/EqualityExpression";
import {UnaryExpression} from "@dawn/lang/ast/expressions/UnaryExpression";
import {Instantiation} from "@dawn/lang/ast/Instantiation";
import {ComparisonExpression} from "@dawn/lang/ast/expressions/ComparisonExpression";
import {BinaryExpression} from "@dawn/lang/ast/expressions/BinaryExpression";
import {Literal} from "@dawn/lang/ast/Literal";
import {ValAccessor} from "@dawn/lang/ast/ValAccessor";

export namespace Typechecker {

  import ProgramTypes = TypeParser.ProgramTypes;

  export function typecheck(program: Program, programTypes: ProgramTypes, diagnostics: DiagnosticReporter) {

  }

  class TypecheckerVisitor implements DeclarationVisitor<void>, StatementVisitor<void>, ExpressionVisitor<ExpressionType | void> {

    private currentModule: ModuleType;
    private currentScope: Scopes.Scope;
    private expectedReturnType: Type | void;

    constructor(
      private readonly diagnostics: DiagnosticReporter,
      private readonly programTypes: ProgramTypes,
    ) {
      this.currentModule = programTypes.globalModuleTypes;
      this.currentScope = { variables: new Map() };
      this.expectedReturnType = undefined;
    }

    typecheck(program: Program, types: ProgramTypes) {
      program.body.forEach(declaration => declaration.acceptDeclarationVisitor(this));
    }

    visitFunctionDeclaration(f: FunctionDeclaration): void {
      this.expectedReturnType = this.readFunctionReturnType(f);
      const parentScope = this.currentScope;
      this.currentScope = { variables: new Map(), parent: parentScope };
      this.typecheckFunctionArguments(f);
      f.body.forEach(statement => statement.acceptStatementVisitor(this));
      this.currentScope = parentScope;
    }

    private typecheckFunctionArguments(f: FunctionDeclaration) {
      f.args.forEach(arg => {
        const type = TypeReader.readType(arg.valueType, this.currentModule);
        if (!type) {
          this.reportUnresolvedType(arg.valueType);
          return;
        }

        this.defineInCurrentScope(arg.valueName, type);
      });
    }

    private readFunctionReturnType(f: FunctionDeclaration): Type {
      const defaultReturnType: Type = Types.newNativeType(Keyword.VOID);
      if (!f.returnType) {
        return defaultReturnType;
      }

      const returnType = TypeReader.readType(f.returnType, this.currentModule);
      if (!returnType) {
        this.reportUnresolvedType(f.returnType);
        return defaultReturnType;
      }

      return returnType;
    }

    visitModuleDeclaration(m: ModuleDeclaration): void {
      const parentModule = this.currentModule;
      const currentModule = this.programTypes.types.get(m);
      if (!currentModule) {
        this.diagnostics.reportRaw('Compiler bug: no type has been matched to module', DiagnosticSeverity.ERROR);
        return;
      }
      this.currentModule = currentModule;

      m.body.forEach(declaration => declaration.acceptDeclarationVisitor(this));

      this.currentModule = parentModule;
    }

    visitEquality(e: EqualityExpression): ExpressionType | void {
      const leftType = e.left.acceptExpressionVisitor(this);
      const rightType = e.right.acceptExpressionVisitor(this);
      if (!leftType || !rightType) {
        return;
      }

      if (Types.areEquatable(leftType, rightType)) {
        return;
      }

      return Types.newNativeType(Keyword.BOOLEAN);
    }

    visitUnary(u: UnaryExpression): ExpressionType | void {
      const rightType = u.right.acceptExpressionVisitor(this);
      if (!rightType) {
        return;
      }

      if (rightType.)

    }

    visitValAccessor(v: ValAccessor): ExpressionType | void {
      throw new Error("Method not implemented.");
    }

    visitLiteral(l: Literal): ExpressionType | void {
      throw new Error("Method not implemented.");
    }

    visitBinary(b: BinaryExpression): ExpressionType | void {
      throw new Error("Method not implemented.");
    }

    visitComparison(c: ComparisonExpression): ExpressionType | void {
      throw new Error("Method not implemented.");
    }

    visitInstantiation(i: Instantiation): ExpressionType | void {
      throw new Error("Method not implemented.");
    }

    visitValDeclaration(v: ValDeclaration): void {
      const valType = v.initializer.acceptExpressionVisitor(this);
      if (!valType) {
        return; // Type could not be evaluated, so we'll let the user fix his code instead of adding another error
      }

      this.defineInCurrentScope(v.name, valType);
    }

    visitExpressionStatement(e: Expression): void {
      e.acceptExpressionVisitor(this);
    }

    visitReturn(r: Return): void {
      const returnedValueType = r.value.acceptExpressionVisitor(this);
      if (!this.expectedReturnType) {
        this.diagnostics.reportRaw('Compiler bug: expected return type has not been defined', DiagnosticSeverity.ERROR);
        return;
      }

      if (!returnedValueType) {
        return;
      }

      if (Types.areSame(this.expectedReturnType, returnedValueType)) {
        return;
      }

      const expectedType = Types.display(this.expectedReturnType);
      const currentType = Types.display(returnedValueType);
      this.diagnostics.report("INCORRECT_TYPE_FOR_EXPRESSION", {templating: {expectedType, currentType}});
    }

    // Not needed
    visitExport(e: Export): void {}
    visitImport(i: Import): void {}
    visitObjectDeclaration(o: ObjectDeclaration): void {}

    private defineInCurrentScope(variableName: string, variableType: Type) {
      try {
        Scopes.define(this.currentScope, variableName, variableType);
      } catch (error) {
        if (error instanceof VariableAlreadyDefinedError) {
          this.diagnostics.report("VARIABLE_ALREADY_DEFINED_IN_SCOPE", { templating: { variable: error.variableAlreadyDefined }});
        }
      }
    }

    private reportUnresolvedType(typeName: Accessor) {
      this.diagnostics.report("UNRESOLVED_TYPE", { templating: { typeName: describeAccessor(typeName) }});
    }
  }
}
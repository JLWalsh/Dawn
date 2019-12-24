import {Program} from "@dawn/lang/ast/Program";
import {ModuleSymbol} from "@dawn/analysis/symbols/ModuleSymbol";
import {DeclarationVisitor} from "@dawn/lang/ast/DeclarationNode";
import {Export} from "@dawn/lang/ast/Export";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";
import {Import} from "@dawn/lang/ast/Import";
import {ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";
import {ObjectDeclaration} from "@dawn/lang/ast/declarations/ObjectDeclaration";
import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
import {Scope} from "@dawn/analysis/scopes/Scope";
import {ModuleScope} from "@dawn/analysis/scopes/ModuleScope";
import {ObjectSymbol} from "@dawn/analysis/symbols/ObjectSymbol";
import {ExportedSymbol} from "@dawn/analysis/symbols/ExportedSymbol";
import {ValSymbol} from "@dawn/analysis/symbols/ValSymbol";
import {GlobalScope} from "@dawn/analysis/scopes/GlobalScope";
import {FunctionSymbol} from "@dawn/analysis/symbols/FunctionSymbol";
import {FunctionScope} from "@dawn/analysis/scopes/FunctionScope";
import {StatementVisitor} from "@dawn/lang/ast/Statement";
import {Expression, ExpressionVisitor} from "@dawn/lang/ast/Expression";
import {Return} from "@dawn/lang/ast/Return";
import {BinaryExpression} from "@dawn/lang/ast/expressions/BinaryExpression";
import {ComparisonExpression} from "@dawn/lang/ast/expressions/ComparisonExpression";
import {EqualityExpression} from "@dawn/lang/ast/expressions/EqualityExpression";
import {Instantiation} from "@dawn/lang/ast/Instantiation";
import {Literal} from "@dawn/lang/ast/Literal";
import {UnaryExpression} from "@dawn/lang/ast/expressions/UnaryExpression";
import {ValAccessor} from "@dawn/lang/ast/ValAccessor";

export class SymbolParser {

  public static readonly GLOBAL_MODULE_NAME = '__DAWN_GLOBAL__';

  parseAllSymbols(program: Program, diagnosticReporter: DiagnosticReporter): ModuleSymbol {
    const visitor = new SymbolParserVisitor(diagnosticReporter);

    program.body.forEach(c => visitor.visitDeclaration(c));

    return visitor.getGlobalModule();
  }

}

class SymbolParserVisitor implements DeclarationVisitor<ISymbol>, StatementVisitor<ISymbol | void>, ExpressionVisitor<ISymbol | void> {

  constructor(
    private readonly scopeStack: Scope[],
    private readonly diagnostics: DiagnosticReporter,
  ) {}

  parseAllSymbolsIn(program: Program) {
    const globalScope = new GlobalScope();
    this.scopeStack.push(globalScope);

    program.body.forEach(declaration => {
      const symbol = declaration.acceptDeclarationVisitor(this);
      this.publishSymbol(symbol)
    });

    return globalScope;
  }

  visitExport(e: Export): ISymbol {
    const symbolToExport = e.exported.acceptDeclarationVisitor(this);

    return new ExportedSymbol(symbolToExport);
  }

  visitFunctionDeclaration(f: FunctionDeclaration): ISymbol {
    const functionSymbol = new FunctionSymbol(f.name);
    const publishedFunctionSymbol = this.publishOrGetSymbol(functionSymbol);

    if (!(publishedFunctionSymbol instanceof FunctionSymbol)) {
      // TODO add args to this error
      this.diagnostics.report("CONFLICTING_TYPES_FOR_SYMBOL");
      return functionSymbol;
    }

    const functionScope = new FunctionScope();
    publishedFunctionSymbol.addPrototype(f.args, f.returnType, functionScope);

    f.body.forEach(declaration => {
      const symbol = declaration.acceptStatementVisitor(this);
      this.publishSymbol(symbol);
    });

    return publishedFunctionSymbol;
  }

  visitImport(i: Import): ISymbol {
    const importedModuleSymbol = new ModuleSymbol(i.importedModule.name, new ModuleScope());
    this.publishSymbol(importedModuleSymbol);

    return importedModuleSymbol;
  }

  visitModuleDeclaration(m: ModuleDeclaration): ISymbol {
    const moduleScope = new ModuleScope();
    const moduleSymbol = new ModuleSymbol(m.name, moduleScope);

    this.scopeStack.push(moduleScope);

    m.body.forEach(content => {
      const symbolInModule = content.acceptDeclarationVisitor(this);

      this.publishSymbol(symbolInModule);
    });

    this.scopeStack.pop();

    return moduleSymbol;
  }

  visitObjectDeclaration(o: ObjectDeclaration): ISymbol {
    return new ObjectSymbol(o.name);
  }

  visitValDeclaration(v: ValDeclaration): ISymbol {
    return new ValSymbol(v.name);
  }

  visitExpressionStatement(e: Expression): ISymbol | void {
    return e.acceptExpressionVisitor(this);
  }

  visitReturn(r: Return): ISymbol | void {
    // Do nothing
  }

  visitBinary(b: BinaryExpression): ISymbol | void {
    b.left.acceptExpressionVisitor(this);
    b.right.acceptExpressionVisitor(this);
  }

  visitComparison(c: ComparisonExpression): ISymbol | void {
    return undefined;
  }

  visitEquality(e: EqualityExpression): ISymbol | void {
    return undefined;
  }

  visitInstantiation(i: Instantiation): ISymbol | void {
    return undefined;
  }

  visitLiteral(l: Literal): ISymbol | void {
    return undefined;
  }

  visitUnary(u: UnaryExpression): ISymbol | void {
    return undefined;
  }

  visitValAccessor(v: ValAccessor): ISymbol | void {
    return undefined;
  }

  private publishSymbol(symbol: ISymbol) {
    this.getCurrentScope().addSymbol(symbol);
  }

  private publishOrGetSymbol(symbol: ISymbol) {
    const existingSymbol = this.getCurrentScope().getSymbol(symbol.getName());
    if (existingSymbol) {
      return existingSymbol;
    }

    this.publishSymbol(symbol);

    return symbol;
  }

  private getCurrentScope(): Scope {
    return this.scopeStack[this.scopeStack.length - 1];
  }

}


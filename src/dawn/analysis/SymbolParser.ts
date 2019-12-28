import {Program} from "@dawn/lang/ast/Program";
import {ModuleSymbol} from "@dawn/analysis/symbols/ModuleSymbol";
import {DeclarationVisitor} from "@dawn/lang/ast/DeclarationNode";
import {Export} from "@dawn/lang/ast/Export";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";
import {Import} from "@dawn/lang/ast/Import";
import {ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";
import {ObjectDeclaration} from "@dawn/lang/ast/declarations/ObjectDeclaration";
import {ISymbol, ISymbolVisibility} from "@dawn/analysis/symbols/ISymbol";
import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
import {ExportedSymbol} from "@dawn/analysis/symbols/ExportedSymbol";
import {FunctionSymbol, FunctionSymbolPrototype} from "@dawn/analysis/symbols/FunctionSymbol";
import {StatementVisitor} from "@dawn/lang/ast/Statement";
import {Expression} from "@dawn/lang/ast/Expression";
import {Return} from "@dawn/lang/ast/Return";
import {ObjectSymbol, ObjectSymbolValue} from "@dawn/analysis/symbols/ObjectSymbol";
import ast from "@dawn/lang/ast/builder/Ast";
import {ValSymbol} from "@dawn/analysis/symbols/ValSymbol";
import {SymbolAlreadyDefinedError} from "@dawn/analysis/errors/SymbolAlreadyDefinedError";
import {Scope} from "@dawn/analysis/Scope";

export class SymbolParser {

  parseAllSymbols(program: Program, diagnosticReporter: DiagnosticReporter): Scope {
    const globalScope = new Scope();
    const visitor = new SymbolParserVisitor(globalScope, diagnosticReporter);

    visitor.parseAllSymbolsIn(program);

    return globalScope;
  }

}

class SymbolParserVisitor implements DeclarationVisitor<void>, StatementVisitor<void> {

  constructor(
    initialScope: Scope,
    private readonly diagnostics: DiagnosticReporter,
    private readonly scopeStack: Scope[] = [],
    private exportNextSymbol = false,
  ) {
    this.scopeStack = [initialScope];
  }

  parseAllSymbolsIn(program: Program) {
    program.body.forEach(declaration => declaration.acceptDeclarationVisitor(this));
  }

  visitExport(e: Export): void {
    this.exportNextSymbol = true;
    e.exported.acceptDeclarationVisitor(this);
  }

  visitExpressionStatement(e: Expression): void {
    return undefined; // An expression cannot be named, therefore it cannot be a symbol
  }

  visitFunctionDeclaration(f: FunctionDeclaration) {
    const symbolOfFunction = this.getSymbolInCurrentScope(f.name);
    if (symbolOfFunction) {
      const currentVisibility = this.exportNextSymbol ? ISymbolVisibility.EXPORTED : ISymbolVisibility.INTERNAL;
      if (!symbolOfFunction.isVisibility(currentVisibility)) {
        this.diagnostics.report("INCONSISTENT_SYMBOL_VISIBLITY", { templating: { symbol: f.name } });
        return;
      }

      if (!(symbolOfFunction instanceof FunctionSymbol)) {
        this.diagnostics.report("CANNOT_REDEFINE_SYMBOL", { templating: { symbol: f.name } });
        return;
      }
    }

    const functionSymbol = symbolOfFunction || new FunctionSymbol(f.name);
    if (!symbolOfFunction) {
      this.publishSymbol(functionSymbol);
    }

    const functionScope = new Scope();
    const functionPrototype = new FunctionSymbolPrototype(f.returnType, f.args, functionScope);
    if (functionSymbol.hasPrototype(functionPrototype))
    {
      this.diagnostics.report("FUNCTION_PROTOTYPE_ALREADY_DEFINED", { templating: { functionName: f.name }});
      return;
    }

    functionSymbol.addPrototype(functionPrototype);

    this.scopeStack.push(functionScope);
    f.body.forEach(statement => statement.acceptStatementVisitor(this));
    this.scopeStack.pop();
  }

  visitImport(i: Import) {
    const importedModuleSymbol = new ModuleSymbol(i.importedModule.name);
    this.publishSymbol(importedModuleSymbol);
  }

  visitModuleDeclaration(m: ModuleDeclaration) {
    const moduleScope = new Scope();
    const moduleSymbol = new ModuleSymbol(m.name, moduleScope);
    this.publishSymbol(moduleSymbol);

    this.scopeStack.push(moduleScope);
    m.body.forEach(content => content.acceptDeclarationVisitor(this));
    this.scopeStack.pop();
  }

  visitObjectDeclaration(o: ObjectDeclaration) {
    const objectSymbolValues = o.values.map(value => new ObjectSymbolValue(value.name, value.type));
    const objectSymbol = new ObjectSymbol(o.name, objectSymbolValues);

    this.publishSymbol(objectSymbol);
  }

  visitReturn(r: Return): void {
    return; // Do nothing
  }

  visitValDeclaration(v: ValDeclaration): void {
    const valSymbol = new ValSymbol(v.name);
    this.publishSymbol(valSymbol);
  }

  private publishSymbol(symbol: ISymbol) {
    const symbolToPublish = this.exportNextSymbol ? new ExportedSymbol(symbol) : symbol;
    this.exportNextSymbol = false;

    try {
      this.getCurrentScope().addSymbol(symbolToPublish);
    } catch (error) {
      if (!(error instanceof SymbolAlreadyDefinedError)) {
        throw error;
      }

      this.diagnostics.report("CANNOT_REDEFINE_SYMBOL", { templating: { symbol: symbol.getName() }});
    }
  }

  private getSymbolInCurrentScope(name: string): ISymbol | void {
    const currentScope = this.getCurrentScope();

    if (!currentScope) {
      return;
    }

    return currentScope.getSymbol(name);
  }

  private getCurrentScope() {
    return this.scopeStack[this.scopeStack.length - 1];
  }
}


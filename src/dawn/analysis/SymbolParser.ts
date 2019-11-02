import {Program} from "@dawn/lang/ast/Program";
import {ModuleSymbol} from "@dawn/analysis/symbols/ModuleSymbol";
import {DeclarationVisitor} from "@dawn/lang/ast/DeclarationNode";
import {Export} from "@dawn/lang/ast/Export";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";
import {Import} from "@dawn/lang/ast/Import";
import {ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";
import {ObjectDeclaration} from "@dawn/lang/ast/declarations/ObjectDeclaration";
import {SymbolVisibility} from "@dawn/analysis/symbols/ISymbol";
import {FunctionSymbol} from "@dawn/analysis/symbols/FunctionSymbol";
import {SymbolAlreadyDefinedError} from "@dawn/analysis/errors/SymbolAlreadyDefinedError";
import {ObjectDeclarationSymbol} from "@dawn/analysis/symbols/ObjectDeclarationSymbol";
import {ValSymbol} from "@dawn/analysis/symbols/ValSymbol";
import {FunctionVisibilityMismatchError} from "@dawn/analysis/errors/FunctionVisibilityMismatchError";
import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";

export class SymbolParser {

  public static readonly GLOBAL_MODULE_NAME = '__DAWN_GLOBAL__';

  parseAllSymbols(program: Program, diagnosticReporter: DiagnosticReporter): ModuleSymbol {
    const visitor = new SymbolParserVisitor(diagnosticReporter);

    program.body.forEach(c => c.acceptDeclarationVisitor(visitor));

    return visitor.getGlobalModule();
  }

}

class SymbolParserVisitor implements DeclarationVisitor<void> {

  constructor(
    private readonly diagnosticReporter: DiagnosticReporter,
    private currentModule = new ModuleSymbol(SymbolVisibility.INTERNAL, SymbolParser.GLOBAL_MODULE_NAME),
    private exportNextSymbol = false,
  ) {}

  getGlobalModule() {
    return this.currentModule;
  }

  visitExport(e: Export): void {
    this.exportNextSymbol = true;
    e.exported.acceptDeclarationVisitor(this);
  }

  visitFunctionDeclaration(f: FunctionDeclaration): void {
    const functionSymbol = new FunctionSymbol(this.getSymbolVisibility(), f.name);
    const existingSymbol = this.currentModule.get(f.name);

    if (existingSymbol) {
      if (!(existingSymbol instanceof FunctionSymbol)) {
        const existingSymbolNode
        this.diagnosticReporter.report("SYMBOL_ALREADY_DEFINED", undefined, { subjects: [f, existingSymbol.node] });
        return;
      }

      if (existingSymbol.visibility != functionSymbol.visibility) {
        this.diagnosticReporter.report("INCONSISTENT_FUNCTION_VISIBILITY", undefined, { subjects: [f] });
      }

      this.definePrototype(f, existingSymbol);
      return;
    }

    this.definePrototype(f, functionSymbol);
    this.currentModule.define(f.name, functionSymbol);
  }

  visitImport(i: Import): void {
    // Do nothing
  }

  visitModuleDeclaration(m: ModuleDeclaration): void {
    const module = new ModuleSymbol(this.getSymbolVisibility(), m.name, this.currentModule);
    this.currentModule.define(m.name, module);
    this.currentModule = module;

    m.body.forEach(b => b.acceptDeclarationVisitor(this));

    this.currentModule = module.getParent() as ModuleSymbol;
  }

  visitObjectDeclaration(o: ObjectDeclaration): void {
    const objectDeclarationSymbol = new ObjectDeclarationSymbol(this.getSymbolVisibility(), o.name, o);
    this.currentModule.define(o.name, objectDeclarationSymbol);
  }

  visitValDeclaration(v: ValDeclaration): void {
    const constantSymbol = new ValSymbol(this.getSymbolVisibility(), v.name);
    this.currentModule.define(v.name, constantSymbol);
  }

  private definePrototype(f: FunctionDeclaration, functionSymbol: FunctionSymbol) {
    functionSymbol.definePrototype(f.args, f.returnType);
  }

  private getSymbolVisibility(): SymbolVisibility {
    if (this.exportNextSymbol) {
      this.exportNextSymbol = false;

      return SymbolVisibility.EXPORTED;
    }

    return SymbolVisibility.INTERNAL;
  }

}

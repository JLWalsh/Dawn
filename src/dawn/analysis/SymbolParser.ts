import {Program} from "@dawn/lang/ast/Program";
import {ModuleSymbol} from "@dawn/analysis/symbols/ModuleSymbol";
import {Declaration, DeclarationVisitor} from "@dawn/lang/ast/DeclarationNode";
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
import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";

export class SymbolParser {

  public static readonly GLOBAL_MODULE_NAME = '__DAWN_GLOBAL__';

  parseAllSymbols(program: Program, diagnosticReporter: DiagnosticReporter): ModuleSymbol {
    const visitor = new SymbolParserVisitor(diagnosticReporter);

    program.body.forEach(c => visitor.visitDeclaration(c));

    return visitor.getGlobalModule();
  }

}

class SymbolParserVisitor implements DeclarationVisitor<void> {

  constructor(
    private readonly diagnosticReporter: DiagnosticReporter,
    private currentModule = new ModuleSymbol(SymbolVisibility.INTERNAL, SymbolParser.GLOBAL_MODULE_NAME),
    private exportNextSymbol = false,
  ) {}

  public visitDeclaration(declaration: Declaration | Import | Export) {
    try {
      declaration.acceptDeclarationVisitor(this);
    } catch (error) {
      if (error instanceof SymbolAlreadyDefinedError) {
        this.diagnosticReporter.report("SYMBOL_ALREADY_DEFINED", { templating: { symbol: error.existingSymbol.name } });
      }
    }
  }

  getGlobalModule() {
    return this.currentModule;
  }

  visitExport(e: Export): void {
    this.exportNextSymbol = true;
    this.visitDeclaration(e.exported);
  }

  visitFunctionDeclaration(f: FunctionDeclaration): void {
    const functionSymbol = new FunctionSymbol(this.getSymbolVisibility(), f.name);
    const existingSymbol = this.currentModule.get(f.name);

    if (existingSymbol) {
      if (!(existingSymbol instanceof FunctionSymbol)) {
        this.diagnosticReporter.report("SYMBOL_ALREADY_DEFINED");
        return;
      }

      if (existingSymbol.visibility != functionSymbol.visibility) {
        this.diagnosticReporter.report("INCONSISTENT_FUNCTION_VISIBILITY");
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

    m.body.forEach(b => this.visitDeclaration(b));

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

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

export class SymbolParser {

  public static readonly GLOBAL_MODULE_NAME = '__DAWN_GLOBAL__';

  parseAllSymbols(program: Program, diagnosticReporter: DiagnosticReporter): ModuleSymbol {
    const visitor = new SymbolParserVisitor(diagnosticReporter);

    program.body.forEach(c => visitor.visitDeclaration(c));

    return visitor.getGlobalModule();
  }

}

class SymbolParserVisitor implements DeclarationVisitor<ISymbol> {

  constructor(
    private readonly scopeStack: Scope[],
    private readonly diagnostics: DiagnosticReporter,
  ) {}

  visitExport(e: Export): ISymbol {
    const symbolToExport = e.exported.acceptDeclarationVisitor(this);

    pu
  }

  visitFunctionDeclaration(f: FunctionDeclaration): ISymbol {
    return undefined;
  }

  visitImport(i: Import): ISymbol {
    return undefined;
  }

  visitModuleDeclaration(m: ModuleDeclaration): ISymbol {
    return undefined;
  }

  visitObjectDeclaration(o: ObjectDeclaration): ISymbol {
    return undefined;
  }

  visitValDeclaration(v: ValDeclaration): ISymbol {
    return undefined;
  }

  private publishSymbol(symbol: ISymbol) {
    this.getCurrentScope().addSymbol(symbol);
  }

  private publishInternalSymbol(symbol: ISymbol) {
    const currentScope = this.getCurrentScope();
    if (!(currentScope instanceof ModuleScope)) {
      this.diagnostics.getWithSeverityOf()
    }
  }

  private publishExternalSymbol(symbol: ISymbol) {

  }

  private getCurrentScope(): Scope {
    return this.scopeStack[this.scopeStack.length - 1];
  }

}

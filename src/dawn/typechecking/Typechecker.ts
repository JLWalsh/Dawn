import {Program} from "@dawn/lang/ast/Program";
import {Scope} from "@dawn/analysis/Scope";
import {TypeContext} from "@dawn/typechecking/TypeContext";
import {TypeExpander} from "@dawn/typechecking/TypeExpander";
import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
import {SymbolResolver} from "@dawn/analysis/SymbolResolver";
import {ObjectSymbol} from "@dawn/analysis/symbols/ObjectSymbol";
import {DeclarationVisitor} from "@dawn/lang/ast/DeclarationNode";
import {Export} from "@dawn/lang/ast/Export";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";
import {ObjectDeclaration} from "@dawn/lang/ast/declarations/ObjectDeclaration";
import {ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {Import} from "@dawn/lang/ast/Import";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";

export class Typechecker {

  constructor(
    private readonly diagnostics: DiagnosticReporter,
    private readonly symbolResolver: SymbolResolver,
  ) {}

  typecheck(program: Program, globalScope: Scope): TypeContext {
    const typeContext = new TypeContext();

    this.expandObjectTypesOf(globalScope, typeContext);

    return typeContext;
  }

  private expandObjectTypesOf(scope: Scope, typeContext: TypeContext) {
    const typeExpander = new TypeExpander(typeContext, this.diagnostics, this.symbolResolver);
    const objectSymbols = scope.listSymbolsMatching((symbol): symbol is ObjectSymbol => symbol instanceof ObjectSymbol);

    for (const symbol of objectSymbols) {
      typeExpander.expandObjectType(symbol, scope);

      const scopeOfSymbol = symbol.getScope();
      if (scopeOfSymbol) {
        this.expandObjectTypesOf(scopeOfSymbol, typeContext);
      }
    }
  }

  private typecheckProgram(program: Program, globalScope: Scope, typeContext: TypeContext) {
    const typecheckerVisitor = new ProgramTypecheckerVisitor();

    program.body.forEach(entry => entry.acceptDeclarationVisitor(typecheckerVisitor));
  }
}

class ProgramTypecheckerVisitor implements DeclarationVisitor<void> {

  visitExport(e: Export): void {
    // do nothing
  }

  visitFunctionDeclaration(f: FunctionDeclaration): void {
    return undefined;
  }

  visitImport(i: Import): void {
    return undefined;
  }

  visitModuleDeclaration(m: ModuleDeclaration): void {
    return undefined;
  }

  visitObjectDeclaration(o: ObjectDeclaration): void {
    return undefined;
  }

  visitValDeclaration(v: ValDeclaration): void {
    return undefined;
  }

}

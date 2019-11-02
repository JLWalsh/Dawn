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
import {ConstantSymbol} from "@dawn/analysis/symbols/ConstantSymbol";
import {FunctionVisibilityMismatchError} from "@dawn/analysis/errors/FunctionVisibilityMismatchError";

export class SymbolParser implements DeclarationVisitor<void> {

  public static readonly GLOBAL_MODULE_NAME = '__DAWN_GLOBAL__';

  private currentModule!: ModuleSymbol;
  private exportNextSymbol: boolean = false;

  parseAllSymbols(program: Program): ModuleSymbol {
    this.currentModule = new ModuleSymbol(SymbolVisibility.INTERNAL, SymbolParser.GLOBAL_MODULE_NAME);

    program.body.forEach(c => c.acceptDeclarationVisitor(this));

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
        throw new SymbolAlreadyDefinedError(existingSymbol, functionSymbol);
      }

      if (existingSymbol.visibility != functionSymbol.visibility) {
        throw new FunctionVisibilityMismatchError();
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
    const module = new ModuleSymbol(this.getSymbolVisibility(), this.currentModule);
    this.currentModule.define(m.name, module);
    this.currentModule = module;

    m.body.forEach(b => b.acceptDeclarationVisitor(this));

    this.currentModule = module.getParent() as ModuleSymbol;
  }

  visitObjectDeclaration(o: ObjectDeclaration): void {
    const objectDeclarationSymbol = new ObjectDeclarationSymbol(this.getSymbolVisibility(), o.name, o.values);
    this.currentModule.define(o.name, objectDeclarationSymbol);
  }

  visitValDeclaration(v: ValDeclaration): void {
    const constantSymbol = new ConstantSymbol(this.getSymbolVisibility(), v.name);
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

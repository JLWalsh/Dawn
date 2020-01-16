import {DeclarationVisitor} from "@dawn/lang/ast/DeclarationNode";
import {Export} from "@dawn/lang/ast/Export";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";
import {Import} from "@dawn/lang/ast/Import";
import {ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {ObjectDeclaration} from "@dawn/lang/ast/declarations/ObjectDeclaration";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";
import {SymbolFactory} from "@dawn/analysis/symbols/SymbolFactory";
import {Program} from "@dawn/lang/ast/Program";
import {SymbolAnnotator} from "@dawn/analysis/symbols/SymbolAnnotator";
import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
import {IExportableSymbolVisibility} from "@dawn/analysis/symbols/IExportableSymbol";
import {IModuleSymbol} from "@dawn/analysis/symbols/IModuleSymbol";

export class SymbolParserVisitor implements DeclarationVisitor<void> {

  private exportNextSymbol = false;
  private symbolAnnotator!: SymbolAnnotator;
  private currentModule!: IModuleSymbol;

  constructor(
    private readonly symbolFactory: SymbolFactory,
  ) {}

  discoverAllIn(program: Program): SymbolAnnotator {
    this.symbolAnnotator = new SymbolAnnotator();
    this.exportNextSymbol = false;
    this.currentModule = this.symbolFactory.globalModule();

    program.body.forEach(node => node.acceptDeclarationVisitor(this));

    return this.symbolAnnotator;
  }

  visitObjectDeclaration(o: ObjectDeclaration): void {
    const objectSymbol = this.symbolFactory.objectSymbol(o, this.getSymbolVisibility(), this.currentModule);
    this.symbolAnnotator.annotateNode(o, objectSymbol);
    this.publishSymbolInModule(objectSymbol);
  }

  visitModuleDeclaration(m: ModuleDeclaration): void {
    const parentModule = this.currentModule;

    const moduleSymbol = this.symbolFactory.moduleSymbol(m, this.getSymbolVisibility(), this.currentModule);
    this.symbolAnnotator.annotateNode(m, moduleSymbol);

    this.currentModule = moduleSymbol;
    m.body.forEach(node => node.acceptDeclarationVisitor(this));
    this.currentModule = parentModule;

    this.publishSymbolInModule(moduleSymbol);
  }

  visitFunctionDeclaration(f: FunctionDeclaration): void {
    const functionSymbol = this.symbolFactory.functionSymbol(f, this.getSymbolVisibility());
    this.symbolAnnotator.annotateNode(f, functionSymbol);
    this.publishSymbolInModule(functionSymbol);
  }

  visitValDeclaration(v: ValDeclaration): void {
    const valSymbol = this.symbolFactory.valSymbol(v, this.getSymbolVisibility());
    this.symbolAnnotator.annotateNode(v, valSymbol);
    this.publishSymbolInModule(valSymbol);
  }

  visitExport(e: Export): void {
    this.exportNextSymbol = true;
    e.exported.acceptDeclarationVisitor(this);
  }

  visitImport(i: Import): void {
    // Do nothing
  }

  private publishSymbolInModule(symbol: ISymbol) {
    this.currentModule.addMember(symbol);
  }

  private getSymbolVisibility() {
    const visibility = this.exportNextSymbol ? IExportableSymbolVisibility.EXPORTED : IExportableSymbolVisibility.INTERNAL;
    this.exportNextSymbol = false;

    return visibility;
  }
}

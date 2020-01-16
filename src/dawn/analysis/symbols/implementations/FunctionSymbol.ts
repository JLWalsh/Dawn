import {IFunctionSymbol} from "@dawn/analysis/symbols/IFunctionSymbol";
import {IArgumentSymbol} from "@dawn/analysis/symbols/IArgumentSymbol";
import {IModuleSymbol} from "@dawn/analysis/symbols/IModuleSymbol";
import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
import {ITypeSymbol} from "@dawn/analysis/symbols/ITypeSymbol";
import {SymbolKind} from "@dawn/analysis/symbols/SymbolKind";
import {IExportableSymbolVisibility} from "@dawn/analysis/symbols/IExportableSymbol";

export class FunctionSymbol implements IFunctionSymbol {

  constructor(
    private readonly name: string,
    private readonly returnType: ITypeSymbol,
    private readonly containingModule: IModuleSymbol | void,
    private readonly visibility: IExportableSymbolVisibility,
    private readonly args: IArgumentSymbol[] = [],
  ) {}

  addArgument(arg: IArgumentSymbol) {
    this.args.push(arg);
  }

  getArguments(): IArgumentSymbol[] {
    return this.args;
  }

  getContainingModule(): IModuleSymbol | void {
    return this.containingModule;
  }

  getKind(): SymbolKind.FUNCTION {
    return SymbolKind.FUNCTION;
  }

  getName(): string {
    return this.name;
  }

  getReturnType(): ITypeSymbol | void {
    return this.returnType;
  }

  getVisibility(): IExportableSymbolVisibility {
    return this.visibility;
  }

  getContainingSymbol(): ISymbol | void {
    return;
  }

  getContainingType(): ITypeSymbol | void {
    return;
  }


}
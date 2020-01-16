import {IArgumentSymbol} from "@dawn/analysis/symbols/IArgumentSymbol";
import {IModuleSymbol} from "@dawn/analysis/symbols/IModuleSymbol";
import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
import {ITypeSymbol} from "@dawn/analysis/symbols/ITypeSymbol";
import {SymbolKind} from "@dawn/analysis/symbols/SymbolKind";
import {IFunctionSymbol} from "@dawn/analysis/symbols/IFunctionSymbol";

export class ArgumentSymbol implements IArgumentSymbol {

  constructor(
    private readonly containingFunctionSymbol: IFunctionSymbol,
    private readonly argumentName: string,
    private readonly argumentType: ITypeSymbol,
  ) {}

  getContainingSymbol(): ISymbol | void {
    return this.containingFunctionSymbol;
  }

  getName(): string {
    return this.argumentName;
  }

  getType(): ITypeSymbol {
    return this.argumentType;
  }

  getKind(): SymbolKind.ARGUMENT {
    return SymbolKind.ARGUMENT;
  }

  getContainingType(): ITypeSymbol | void {
    return;
  }

  getContainingModule(): IModuleSymbol | void {
    return;
  }
}
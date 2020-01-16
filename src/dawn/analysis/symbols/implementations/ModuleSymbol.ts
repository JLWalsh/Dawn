import {IModuleSymbol} from "@dawn/analysis/symbols/IModuleSymbol";
import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
import {ITypeSymbol} from "@dawn/analysis/symbols/ITypeSymbol";
import {SymbolKind} from "@dawn/analysis/symbols/SymbolKind";
import {IExportableSymbolVisibility} from "@dawn/analysis/symbols/IExportableSymbol";

export class ModuleSymbol implements IModuleSymbol {

  constructor(
    private readonly name: string,
    private readonly visibility: IExportableSymbolVisibility,
    private readonly containingModule: IModuleSymbol | void,
    private readonly members: ISymbol[] = [],
  ) {}

  addMember(symbol: ISymbol): void {
    this.members.push(symbol);
  }

  getContainingModule(): IModuleSymbol | void {
    return this.containingModule;
  }

  getKind(): SymbolKind.MODULE {
    return SymbolKind.MODULE;
  }

  getMembers(): ISymbol[] {
    return [];
  }

  getName(): string {
    return this.name;
  }

  getVisibility(): IExportableSymbolVisibility {
    return this.visibility;
  }

  getContainingSymbol(): ISymbol | void {
    return undefined;
  }

  getContainingType(): ITypeSymbol | void {
    return undefined;
  }
}
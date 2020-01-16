import {IObjectPropertySymbol, IObjectPropertySymbolVisibility} from "@dawn/analysis/symbols/IObjectPropertySymbol";
import {IModuleSymbol} from "@dawn/analysis/symbols/IModuleSymbol";
import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
import {ITypeSymbol} from "@dawn/analysis/symbols/ITypeSymbol";
import {SymbolKind} from "@dawn/analysis/symbols/SymbolKind";
import {IObjectSymbol} from "@dawn/analysis/symbols/IObjectSymbol";

export class ObjectPropertySymbol implements IObjectPropertySymbol {

  constructor(
    private readonly name: string,
    private readonly type: ITypeSymbol,
    private readonly containingType: IObjectSymbol,
    private readonly visibility: IObjectPropertySymbolVisibility,
  ) {}

  getContainingType(): ITypeSymbol | void {
    return this.containingType;
  }

  getKind(): SymbolKind.OBJECT_PROP {
    return SymbolKind.OBJECT_PROP;
  }

  getName(): string {
    return this.name;
  }

  getType(): ITypeSymbol {
    return this.type;
  }

  getVisibity(): IObjectPropertySymbolVisibility {
    return this.visibility;
  }

  getContainingModule(): IModuleSymbol | void {
    return undefined;
  }

  getContainingSymbol(): ISymbol | void {
    return undefined;
  }
}
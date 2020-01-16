import {IObjectSymbol} from "@dawn/analysis/symbols/IObjectSymbol";
import {IModuleSymbol} from "@dawn/analysis/symbols/IModuleSymbol";
import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
import {ITypeSymbol} from "@dawn/analysis/symbols/ITypeSymbol";
import {SymbolKind} from "@dawn/analysis/symbols/SymbolKind";
import {IObjectPropertySymbol} from "@dawn/analysis/symbols/IObjectPropertySymbol";
import {TypeKind} from "@dawn/analysis/typechecking/TypeKind";
import {IExportableSymbolVisibility} from "@dawn/analysis/symbols/IExportableSymbol";

export class ObjectSymbol implements IObjectSymbol {

  constructor(
    private readonly name: string,
    private readonly visibility: IExportableSymbolVisibility,
    private readonly containingModule: IModuleSymbol,
    private readonly properties: IObjectPropertySymbol[] = [],
  ) {}

  addProperty(property: IObjectPropertySymbol) {
    this.properties.push(property);
  }

  getContainingModule(): IModuleSymbol {
    return this.containingModule;
  }

  getKind(): SymbolKind.OBJECT_DECL {
    return SymbolKind.OBJECT_DECL;
  }

  getName(): string {
    return this.name;
  }

  getProperties(): IObjectPropertySymbol[] {
    return this.properties;
  }

  getProperty(name: string): IObjectPropertySymbol | void {
    return undefined;
  }

  getTypeKind(): TypeKind {
    return TypeKind.OBJECT;
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
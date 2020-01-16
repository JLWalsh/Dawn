import {ITypeSymbol} from "@dawn/analysis/symbols/ITypeSymbol";
import {IFunctionSymbol} from "@dawn/analysis/symbols/IFunctionSymbol";
import {IArgumentSymbol} from "@dawn/analysis/symbols/IArgumentSymbol";
import {IModuleSymbol} from "@dawn/analysis/symbols/IModuleSymbol";
import {ObjectDeclaration, ObjectValue} from "@dawn/lang/ast/declarations/ObjectDeclaration";
import {IObjectSymbol} from "@dawn/analysis/symbols/IObjectSymbol";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";
import {IValSymbol} from "@dawn/analysis/symbols/IValSymbol";
import {ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {IExportableSymbolVisibility} from "@dawn/analysis/symbols/IExportableSymbol";
import {FunctionSymbol} from "@dawn/analysis/symbols/implementations/FunctionSymbol";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {ArgumentSymbol} from "@dawn/analysis/symbols/implementations/ArgumentSymbol";
import {FunctionArgument} from "@dawn/lang/ast/declarations/FunctionArgument";
import {ModuleSymbol} from "@dawn/analysis/symbols/implementations/ModuleSymbol";
import {IObjectPropertySymbol, IObjectPropertySymbolVisibility} from "@dawn/analysis/symbols/IObjectPropertySymbol";
import {ObjectPropertySymbol} from "@dawn/analysis/symbols/implementations/ObjectPropertySymbol";
import {ObjectSymbol} from "@dawn/analysis/symbols/implementations/ObjectSymbol";

export class SymbolFactory {

  argumentSymbol(arg: FunctionArgument, containingFunctionSymbol: IFunctionSymbol): IArgumentSymbol {
    const argType = this.typeSymbol(arg.valueType);

    return new ArgumentSymbol(containingFunctionSymbol, arg.valueName, argType);
  };

  functionSymbol(f: FunctionDeclaration, visibility: IExportableSymbolVisibility, containingModule: IModuleSymbol | void): IFunctionSymbol {
    const returnType = this.typeSymbol(f.returnType);
    // Forward ref of function symbol, since there is a circular dependency between the function and it's args
    const functionSymbol = new FunctionSymbol(f.name, returnType, containingModule, visibility);

    f.args.map(arg => this.argumentSymbol(arg, functionSymbol))
    .forEach(arg => functionSymbol.addArgument(arg));

    return functionSymbol;
  };

  moduleSymbol(m: ModuleDeclaration, visibility: IExportableSymbolVisibility, containingModule: IModuleSymbol): IModuleSymbol {
    return new ModuleSymbol(m.name, visibility, containingModule);
  };

  globalModule(): IModuleSymbol {
    const emptyModuleName = "";
    return new ModuleSymbol(emptyModuleName, IExportableSymbolVisibility.INTERNAL);
  }

  objectSymbol(o: ObjectDeclaration, visibility: IExportableSymbolVisibility, containingModule: IModuleSymbol): IObjectSymbol {
    const objectSymbol = new ObjectSymbol(o.name, visibility, containingModule);

    o.values.map(property => this.objectPropertySymbol(property, objectSymbol))
      .forEach(property => objectSymbol.addProperty(property));

    return objectSymbol;
  };

  objectPropertySymbol (property: ObjectValue, containingType: IObjectSymbol): IObjectPropertySymbol {
    const propertyType = this.typeSymbol(property.type);
    const propertyVisibility = IObjectPropertySymbolVisibility.PUBLIC; // TODO use the ObjectValue's visibility when shadowed (private) symbols are implemented

    return new ObjectPropertySymbol(property.name, propertyType, containingType, propertyVisibility);
  };

  valSymbol(v: ValDeclaration, visibility: IExportableSymbolVisibility): IValSymbol {

  };

  typeSymbol(returnType: Accessor | null): ITypeSymbol {

  };

}

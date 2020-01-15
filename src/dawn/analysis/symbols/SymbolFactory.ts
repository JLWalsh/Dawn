import {ITypeSymbol} from "@dawn/analysis/symbols/ITypeSymbol";
import {IFunctionSymbol} from "@dawn/analysis/symbols/IFunctionSymbol";
import {IArgumentSymbol} from "@dawn/analysis/symbols/IArgumentSymbol";
import {SymbolKind} from "@dawn/analysis/symbols/SymbolKind";
import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
import {Scope} from "@dawn/analysis/Scope";
import {IModuleSymbol} from "@dawn/analysis/symbols/IModuleSymbol";
import {SymbolVisibility} from "@dawn/analysis/symbols/SymbolVisibility";

export class SymbolFactory {

  argumentSymbol(name: string, type: ITypeSymbol, func: IFunctionSymbol): IArgumentSymbol {
    return {
      ...this.symbol(name, { symbol: func }),
      getType(): ITypeSymbol {
        return type;
      },
      getKind() {
        return SymbolKind.ARGUMENT;
      },
    };
  }

  functionSymbol(name: string, args: IArgumentSymbol[], returnType: ITypeSymbol, visiblity: SymbolVisibility, module: IModuleSymbol): IFunctionSymbol {
    return {
      ...this.symbol(name, { module }),
      ...this.exportedSymbol(visiblity),
      getKind() {
        return SymbolKind.FUNCTION;
      },
      getArguments(): IArgumentSymbol[] {
        return args;
      },
      getReturnType(): ITypeSymbol | void {
        return returnType;
      },
    };
  }

  moduleSymbol(name: string, members: ISymbol[], visiblity: SymbolVisibility, module?: IModuleSymbol): IModuleSymbol {
    return {
      ...this.symbol(name, { module }),
      ...this.exportedSymbol(visiblity),
      getKind() {
        return SymbolKind.MODULE;
      },
      getMembers(): ISymbol[] {
        return members;
      },
    };
  }

  objectPropertySymbol(name: string)

  private exportedSymbol(visiblity: SymbolVisibility) {
    return {
      getVisibility(): SymbolVisibility {
        return visiblity;
      }
    }
  }

  private symbol(name: string, { type, symbol, module }: { type?: ITypeSymbol, symbol?: ISymbol, module?: IModuleSymbol }) {
    return {
      getName(): string {
        return name;
      },
      getContainingSymbol(): ISymbol | void {
        return symbol;
      },
      getContainingModule(): IModuleSymbol | void {
        return module;
      },
      getContainingType(): ITypeSymbol | void {
        return type;
      },
    };
  }
}

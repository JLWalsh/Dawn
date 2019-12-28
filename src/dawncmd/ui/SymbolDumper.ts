import {ModuleSymbol} from "@dawn/analysis/symbols/ModuleSymbol";
import {FunctionSymbol} from "@dawn/analysis/symbols/FunctionSymbol";
import {ValSymbol} from "@dawn/analysis/symbols/ValSymbol";
import {ObjectSymbol} from "@dawn/analysis/symbols/ObjectSymbol";
import treeify, {TreeObject} from 'treeify';
import {ExportedSymbol} from "@dawn/analysis/symbols/ExportedSymbol";
import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
import {Scope} from "@dawn/analysis/Scope";

export class SymbolDumper {

  static dumpToString(globalScope: Scope): string {
    return treeify.asTree(this.dumpScope(globalScope), true, false);
  }

  private static dumpScope(scope: Scope): TreeObject {
    const dump: any = {};

    scope.getAllSymbols().forEach(s => {
      dump[s.getName()] = this.dumpSymbol(s);
    });

    return dump;
  }

  private static dumpSymbol(s: ISymbol): TreeObject {
    if (s instanceof ModuleSymbol) {
      return this.dumpModuleSymbol(s);
    }

    if (s instanceof FunctionSymbol) {
      return this.dumpFunctionSymbol(s);
    }

    if (s instanceof ValSymbol) {
      return this.dumpValSymbol(s);
    }

    if (s instanceof ObjectSymbol) {
      return this.dumpObjectSymbol(s);
    }

    if (s instanceof ExportedSymbol) {
      return this.dumpExportedSymbol(s);
    }

    throw new Error(`No case found for symbol: ${JSON.stringify(s)}`)
  }

  private static dumpExportedSymbol(e: ExportedSymbol) {
    return {
      exported: 'true',
      ...this.dumpSymbol(e.getSymbol()),
    };
  }

  private static dumpValSymbol(v: ValSymbol) {
    const dump: any = {
      type: 'val',
      name: v.getName(),
    };

    return dump;
  }

  private static dumpObjectSymbol(o: ObjectSymbol) {
    const dump: any = {
      type: 'object',
      values: {},
    };

    o.values().forEach(value => {
      dump.values[value.getName()] = value.getType().name;
    });

    return dump;
  }

  private static dumpFunctionSymbol(f: FunctionSymbol): TreeObject {
    const dump: any = {
      type: 'function',
      implementations: {},
    };

    f.prototypes().forEach((p, i) => {
      const args = p.getArgs().map(a => a.valueType).join(", ");

      const returnType = p.getReturnType();
      dump.implementations[i] = {
        returns: returnType ? returnType.name : 'void',
        args,
        scope: this.dumpScope(p.getScope()),
      }
    });

    return dump;
  }

  private static dumpModuleSymbol(m: ModuleSymbol) {
    const dump: any = {
      type: 'module',
      children: this.dumpScope(m.getScope()),
    };

    return dump;
  }
}

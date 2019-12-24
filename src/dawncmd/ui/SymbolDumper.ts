import {ModuleSymbol} from "@dawn/analysis/symbols/ModuleSymbol";
import {FunctionSymbol} from "@dawn/analysis/symbols/FunctionSymbol";
import {ValSymbol} from "@dawn/analysis/symbols/ValSymbol";
import {ObjectSymbol} from "@dawn/analysis/symbols/ObjectSymbol";
import treeify, {TreeObject} from 'treeify';

export class SymbolDumper {

  static dumpToString(moduleSymbol: ModuleSymbol): string {
    return treeify.asTree(this.dumpToObject(moduleSymbol), true, false);
  }

  private static dumpToObject(moduleSymbol: ModuleSymbol): TreeObject {
    const object: TreeObject = {};

    moduleSymbol.getSymbols().forEach(s => {
      const symbolName = `${s.name} (${s.visibility.valueOf()})`;
      if (s instanceof ModuleSymbol) {
        object[symbolName + ': module'] = this.dumpToObject(s);
        return;
      }

      if (s instanceof FunctionSymbol) {
        object[symbolName] = 'function';
        return;
      }

      if (s instanceof ValSymbol) {
        object[symbolName] = 'val';
        return;
      }

      if (s instanceof ObjectSymbol) {
        object[symbolName] = 'object';
        return;
      }
    });

    return object;
  }
}

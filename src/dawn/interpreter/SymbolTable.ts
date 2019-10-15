import {RuntimeSymbol} from "@dawn/interpreter/RuntimeSymbol";
import {Accessor} from "@dawn/lang/ast/Accessor";

export class SymbolTable {

  constructor(
    private readonly parent: SymbolTable | void,
    private readonly moduleName: string,
    private readonly exported: Map<string, RuntimeSymbol> = new Map(),
    private readonly internal: Map<string, RuntimeSymbol> = new Map(),
  ) {}

  addExported(symbol: RuntimeSymbol) {
    if (this.exported.has(symbol.name)) {
      throw new Error(`Cannot redefine external symbol ${symbol.name}`);
    }

    this.exported.set(symbol.name, symbol);
  }

  addInternal(symbol: RuntimeSymbol) {
    if (this.internal.has(symbol.name)) {
      throw new Error(`Cannot redefine internal symbol ${symbol.name}`);
    }

    this.internal.set(symbol.name, symbol);
  }

  lookup(accessor: Accessor, currentSymbolTable: SymbolTable): RuntimeSymbol {
    const isExportLookup =
  }

  private isParentOrSame(symbolTable: SymbolTable): boolean {
    if (this.)
  }
}

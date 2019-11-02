import {ISymbol, SymbolVisibility} from "@dawn/analysis/symbols/ISymbol";
import {FunctionArgument} from "@dawn/lang/ast/declarations/FunctionArgument";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";

export interface FunctionSymbolPrototype {
  returnType: string | null;
  args: FunctionArgument[];
  implementation: FunctionDeclaration;
}

export class FunctionSymbol implements ISymbol {

  private readonly prototypes: FunctionSymbolPrototype[] = [];

  constructor(
    public readonly visibility: SymbolVisibility,
    public readonly name: string,
  ) {}

  definePrototype(implementation: FunctionDeclaration, args: FunctionArgument[], returnType: string | null) {
    this.prototypes.push({ args, returnType, implementation });
  }

  getImplementations() {
    return this.prototypes.map(p => p.implementation);
  }
}

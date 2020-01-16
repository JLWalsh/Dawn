import {Program} from "@dawn/lang/ast/Program";
import {IObjectSymbol} from "@dawn/analysis/symbols/IObjectSymbol";
import { SymbolParserVisitor } from "@dawn/analysis/symbols/parsing/SymbolParserVisitor";
import {SymbolFactory} from "@dawn/analysis/symbols/SymbolFactory";
import {ITypeSymbol} from "@dawn/analysis/symbols/ITypeSymbol";

export class Typechecker {

  private typeSymbols!: ITypeSymbol[];

  constructor(
    private readonly symbolFactory: SymbolFactory,
  ) {}

  typecheck(program: Program) {
    // 1. Discover all user defined types and expand them (or not idk) (1st AST Pass)
    this.discoverAllTypes(program);
    this.typecheckAllTypes();
    // 2. Typecheck all the AST (2nd AST Pass)
  }

  private discoverAllTypes(program: Program) {
    const typeDiscoveryVisitor = new SymbolParserVisitor(this.symbolFactory);
    this.typeSymbols = typeDiscoveryVisitor.discoverAllIn(program);
  }

  private typecheckAllTypes() {
    const typesToProcess = this.typeSymbols.slice();

    while(typesToProcess.length > 0) {
      const type = typesToProcess.pop();
    }
  }

  private registerStructuralType(structuralType: IObjectSymbol) {

  }
}

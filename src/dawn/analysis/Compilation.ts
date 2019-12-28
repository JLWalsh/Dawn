import {SymbolResolver} from "@dawn/analysis/SymbolResolver";
import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
import {Program} from "@dawn/lang/ast/Program";
import {SymbolParser} from "@dawn/analysis/SymbolParser";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
import {Scope} from "@dawn/analysis/Scope";

export function compile(program: Program, diagnosticReporter: DiagnosticReporter): Compilation {
  const globalSymbols = new SymbolParser().parseAllSymbols(program, diagnosticReporter);

  return new Compilation(globalSymbols, program, new SymbolResolver());
}

export class Compilation {

  constructor(
    public readonly globalScope: Scope,
    public readonly program: Program,
    public readonly symbolResolver: SymbolResolver,
  ) {}

  public resolve(symbolName: Accessor): ISymbol | void {
    return this.symbolResolver.resolve(symbolName, this.globalScope);
  }
}

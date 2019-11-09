import {SymbolResolver} from "@dawn/analysis/SymbolResolver";
import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
import {Program} from "@dawn/lang/ast/Program";
import {ModuleSymbol} from "@dawn/analysis/symbols/ModuleSymbol";
import {SymbolParser} from "@dawn/analysis/SymbolParser";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {ISymbol} from "@dawn/analysis/symbols/ISymbol";

export function compile(program: Program, diagnosticReporter: DiagnosticReporter): Compilation {
  const globalSymbols = new SymbolParser().parseAllSymbols(program, diagnosticReporter);

  return new Compilation(globalSymbols, program, new SymbolResolver());
}

export class Compilation {

  constructor(
    public readonly globalSymbols: ModuleSymbol,
    public readonly program: Program,
    public readonly symbolResolver: SymbolResolver,
  ) {}

  public resolve(symbolName: Accessor): ISymbol | void {
    return this.symbolResolver.resolve(symbolName, this.globalSymbols);
  }
}

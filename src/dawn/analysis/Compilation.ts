import {SymbolResolver} from "@dawn/analysis/SymbolResolver";
import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
import {Program} from "@dawn/lang/ast/Program";
import {ModuleSymbol} from "@dawn/analysis/symbols/ModuleSymbol";
import {SymbolParser} from "@dawn/analysis/SymbolParser";

export function compile(program: Program, diagnosticReporter: DiagnosticReporter): Compilation {
  const globalSymbols = new SymbolParser().parseAllSymbols(program, diagnosticReporter);

  return new Compilation(globalSymbols, program, new SymbolResolver());
}

export class Compilation {

  constructor(
    private readonly globalSymbols: ModuleSymbol,
    private readonly program: Program,
    private readonly symbolResolver: SymbolResolver,
  ) {}

}

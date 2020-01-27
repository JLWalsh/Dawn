import {SymbolScope} from "@dawn/analysis/symbol/SymbolScope";
import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
import {ISymbol} from "@dawn/analysis/symbol/ISymbol";
import {FunctionSymbol} from "@dawn/analysis/symbol/FunctionSymbol";
import {ObjectSymbol} from "@dawn/analysis/symbol/ObjectSymbol";
import {ValSymbol} from "@dawn/analysis/symbol/ValSymbol";

export namespace SymbolTypechecker {

  interface TypecheckingOperation {
    typecheckedSymbols: Set<ISymbol>;
  }

  export function typecheck(symbolScope: SymbolScope, diagnostics: DiagnosticReporter) {
    // 1. For each symbol in scope, typecheck that symbol
    // 2. If already typechecked, skip that symbol
    // 3. Typecheck symbols in child scopes

    const typecheckingOperation: TypecheckingOperation = { typecheckedSymbols: new Set() };
    Array.from(symbolScope.symbols.values()).forEach(symbol => typecheckSymbols(symbol, typecheckingOperation, diagnostics))
  }

  function typecheckSymbols(symbols: ISymbol[], typechecking: TypecheckingOperation, diagnostics: DiagnosticReporter) {
    if (symbols.length === 0) {
      return;
    }

    // If multiple symbols posess the same name, we'll typecheck them using the type of the first symbol
    const firstSymbol = symbols[0];
    if (firstSymbol instanceof FunctionSymbol) {
      return typecheckFunction(firstSymbol, symbols, typechecking, diagnostics);
    }

    if (firstSymbol instanceof ObjectSymbol) {
      if (symbols.length > 1) {
        diagnostics.report("DUPLICATE_DEFINITION_FOR_SYMBOL", { templating: { symbolName: firstSymbol.getName() }});
        return;
      }

      return typecheckObject(firstSymbol, typechecking, diagnostics);
    }

    if (firstSymbol instanceof ValSymbol) {
      if (symbols.length > 1) {
        diagnostics.report("DUPLICATE_DEFINITION_FOR_SYMBOL", { templating: { symbolName: firstSymbol.getName() }});
        return;
      }

      return typecheckVal(firstSymbol, typechecking, diagnostics);
    }
  }

  function typecheckObject(symbol: ObjectSymbol, typechecking: TypecheckingOperation, diagnostics: DiagnosticReporter) {
  }

  function typecheckVal(symbol: ValSymbol, typechecking: TypecheckingOperation, diagnostics: DiagnosticReporter) {

  }

  function typecheckFunction(firstFunction: FunctionSymbol, symbols: ISymbol[], typechecking: TypecheckingOperation, diagnostics: DiagnosticReporter) {
    const allSymbolsAreFunctions = symbols.every(symbol => symbol instanceof FunctionSymbol);
    if (!allSymbolsAreFunctions) {
      diagnostics.report("DUPLICATE_DEFINITION_FOR_SYMBOL", { templating: { symbolName: firstFunction.getName() }});
      return;
    }

    const allFunctionsHaveSameVisibility = symbols.every(symbol => symbol.getVisibility() === firstFunction.getVisibility());
    if (!allFunctionsHaveSameVisibility) {
      diagnostics.report("INCONSISTENT_FUNCTION_VISIBILITY", { templating: { functionName: firstFunction.getName() }});
      return;
    }

  }
}
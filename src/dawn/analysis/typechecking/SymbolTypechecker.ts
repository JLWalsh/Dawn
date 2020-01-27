import {SymbolScope} from "@dawn/analysis/symbol/SymbolScope";
import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
import {ISymbol} from "@dawn/analysis/symbol/ISymbol";
import {FunctionSymbol} from "@dawn/analysis/symbol/FunctionSymbol";
import {ObjectSymbol} from "@dawn/analysis/symbol/ObjectSymbol";
import {ValSymbol} from "@dawn/analysis/symbol/ValSymbol";
import {SymbolResolver} from "@dawn/analysis/typechecking/SymbolResolver";
import {describeAccessor} from "@dawn/lang/ast/Accessor";
import {ObjectType} from "@dawn/analysis/typechecking/types/ObjectType";
import {AnyType} from "@dawn/analysis/typechecking/types/AnyType";
import {Type} from "@dawn/analysis/typechecking/types/Type";

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

  function typecheckSymbols(symbol: ISymbol, scope: SymbolScope, typechecking: TypecheckingOperation, diagnostics: DiagnosticReporter) {
    // If multiple symbols posess the same name, we'll typecheck them using the type of the first symbol
    if (symbol instanceof FunctionSymbol) {
      return typecheckFunction(symbol, typechecking, diagnostics);
    }

    if (symbol instanceof ObjectSymbol) {
      return typecheckObject(symbol, scope, typechecking, diagnostics);
    }

    if (symbol instanceof ValSymbol) {
      return typecheckVal(symbol, typechecking, diagnostics);
    }
  }

  function typecheckObject(symbol: ObjectSymbol, scope: SymbolScope, typechecking: TypecheckingOperation, diagnostics: DiagnosticReporter) {
    const objectDeclaration = symbol.getNode();
    const objectType = new ObjectType();

    objectDeclaration.values.forEach(value => {
      const typeSymbol = SymbolResolver.resolve(value.type, scope);
      if (!typeSymbol) {
        diagnostics.report("UNRESOLVED_TYPE", { templating: { type: describeAccessor(value.type) }})
        return;
      }

      if (!(typeSymbol instanceof ObjectSymbol)) {
        diagnostics.report("SYMBOL_IS_NOT_A_TYPE", { templating: { symbol: typeSymbol.getName() }});
        return;
      }

      if (objectType.hasTypeFor(value.name)) {
        diagnostics.report("DUPLICATE_KEY_IN_OBJECT_DECLARATION", { templating: { object: typeSymbol.getName(), key: value.name }});
        // We replace the duplicated key type with any, so that the code that depends on this key doesn't get more errors because of this problem
        objectType.define(value.name, new AnyType());
        return;
      }

      objectType.define(value.name, typeSymbol);
    });
  }

  function typecheckVal(symbol: ValSymbol, typechecking: TypecheckingOperation, diagnostics: DiagnosticReporter) {

  }

  function typecheckFunction(func: FunctionSymbol, typechecking: TypecheckingOperation, diagnostics: DiagnosticReporter) {

  }

}
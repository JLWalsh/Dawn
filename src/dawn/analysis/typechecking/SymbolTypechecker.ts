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

export namespace SymbolTypechecker {

  interface TypecheckingOperation {
    typecheckedSymbols: Map<ISymbol, Type>;
    diagnostics: DiagnosticReporter;
  }

  export function typecheck(symbolScope: SymbolScope, diagnostics: DiagnosticReporter) {
    // 1. For each symbol in scope, typecheck that symbol
    // 2. If already typechecked, skip that symbol
    // 3. Typecheck symbols in child scopes

    const typecheckingOperation: TypecheckingOperation = { typecheckedSymbols: new Map(), diagnostics };
    Array.from(symbolScope.symbols.values()).forEach(symbol => typecheckSymbol(symbol, symbolScope, typecheckingOperation))
  }

  function typecheckSymbol(symbol: ISymbol, scope: SymbolScope, typechecking: TypecheckingOperation) {
    // If multiple symbols posess the same name, we'll typecheck them using the type of the first symbol
    if (symbol instanceof FunctionSymbol) {
      return typecheckFunction(symbol, typechecking);
    }

    if (symbol instanceof ObjectSymbol) {
      return typecheckObject(symbol, scope, typechecking);
    }

    if (symbol instanceof ValSymbol) {
      return typecheckVal(symbol, typechecking);
    }
  }

  function typecheckObject(symbol: ObjectSymbol, scope: SymbolScope, typechecking: TypecheckingOperation) {
    const objectDeclaration = symbol.getNode();
    const objectType = new ObjectType();

    objectDeclaration.values.forEach(value => {
      const symbolFound = SymbolResolver.resolve(value.type, scope);
      if (!symbolFound) {
        typechecking.diagnostics.report("UNRESOLVED_TYPE", { templating: { type: describeAccessor(value.type) }})
        return;
      }

      const { symbol: typeSymbol, scope: scopeOfTypeSymbol } = symbolFound;
      if (!(typeSymbol instanceof ObjectSymbol)) {
        typechecking.diagnostics.report("SYMBOL_IS_NOT_A_TYPE", { templating: { symbol: typeSymbol.getName() }});
        return;
      }

      if (objectType.hasTypeFor(value.name)) {
        typechecking.diagnostics.report("DUPLICATE_KEY_IN_OBJECT_DECLARATION", { templating: { object: typeSymbol.getName(), key: value.name }});
        // We replace the duplicated key type with any, so that the code that depends on this key doesn't get more errors because of this problem
        objectType.define(value.name, new AnyType());
        return;
      }

      typechecking.typecheckedSymbols.set(symbol, objectType);
      const typeOfSymbol = typechecking.typecheckedSymbols.get(symbol) || typecheckObject(typeSymbol, scopeOfTypeSymbol, typechecking)
      objectType.define(value.name, typeOfSymbol);
    });
  }

  function typecheckVal(symbol: ValSymbol, typechecking: TypecheckingOperation) {

  }

  function typecheckFunction(func: FunctionSymbol, typechecking: TypecheckingOperation) {

  }

}
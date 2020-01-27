import {SymbolScope} from "@dawn/analysis/symbol/SymbolScope";
import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
import {ISymbol} from "@dawn/analysis/symbol/ISymbol";
import {FunctionSymbol} from "@dawn/analysis/symbol/FunctionSymbol";
import {ObjectSymbol} from "@dawn/analysis/symbol/ObjectSymbol";
import {ValSymbol} from "@dawn/analysis/symbol/ValSymbol";
import {SymbolResolver} from "@dawn/analysis/typechecking/SymbolResolver";
import {Accessor, describeAccessor} from "@dawn/lang/ast/Accessor";
import {ObjectType} from "@dawn/analysis/typechecking/types/ObjectType";
import {AnyType} from "@dawn/analysis/typechecking/types/AnyType";
import {Type} from "@dawn/analysis/typechecking/types/Type";
import {NativeType} from "@dawn/analysis/typechecking/types/NativeType";
import {Keyword} from "@dawn/lang/Keyword";
import {Expression} from "@dawn/lang/ast/Expression";
import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {type} from "os";

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

  function typecheckObject(symbol: ObjectSymbol, scope: SymbolScope, typechecking: TypecheckingOperation): Type {
    const objectDeclaration = symbol.getNode();
    const objectType = new ObjectType();
    typechecking.typecheckedSymbols.set(symbol, objectType);

    objectDeclaration.values.forEach(value => {
      if (objectType.hasTypeFor(value.name)) {
        typechecking.diagnostics.report("DUPLICATE_KEY_IN_OBJECT_DECLARATION", { templating: { object: symbol.getName(), key: value.name }});
        // We replace the duplicated key type with any, so that the code that depends on this key doesn't get more errors because of this problem
        objectType.define(value.name, new AnyType());
        return;
      }

      const type = resolveType(value.type, scope, typechecking);

      objectType.define(value.name, type);
    });
  }

  function typecheckVal(symbol: ValSymbol, scope: SymbolScope, typechecking: TypecheckingOperation) {
    const valDeclaration = symbol.getNode();

    function getTypeOfExpression(instantiation: Expression): Type {
      switch(instantiation.type) {
        case AstNodeType.INSTANTIATION: {
          return resolveAsUserType(instantiation.objectType, scope, typechecking);
        }
        case A
      }
    }
  }

  function typecheckFunction(func: FunctionSymbol, typechecking: TypecheckingOperation) {

  }

  function resolveType(type: Accessor, scopeOfTypeReference: SymbolScope, typechecking: TypecheckingOperation): Type {
    return resolveAsNativeType(type) || resolveAsUserType(type, scopeOfTypeReference, typechecking);
  }

  function resolveAsNativeType(type: Accessor): NativeType | void {
    if (type.subAccessor) {
      return;
    }

    if (NativeType.SupportedTypes.has(type.name as Keyword)) {
      return new NativeType(type.name as Keyword);
    }
  }

  function resolveAsUserType(type: Accessor, scopeOfTypeReference: SymbolScope, typechecking: TypecheckingOperation): Type {
    const symbolFound = SymbolResolver.resolve(type, scopeOfTypeReference);
    if (!symbolFound) {
      typechecking.diagnostics.report("UNRESOLVED_TYPE", { templating: { type: describeAccessor(type) }})
      return new AnyType();
    }

    const { symbol: typeSymbol, scope: scopeOfTypeSymbol } = symbolFound;
    if (!assertSymbolIsType(typeSymbol, typechecking)) {
      return new AnyType();
    }

    const typeOfSymbol = typechecking.typecheckedSymbols.get(typeSymbol) || typecheckObject(typeSymbol, scopeOfTypeSymbol, typechecking);

    return typeOfSymbol || new AnyType();
  }

  function assertSymbolIsType(symbol: ISymbol, typechecking: TypecheckingOperation): boolean {
    if (!(symbol instanceof ObjectSymbol)) {
      typechecking.diagnostics.report("SYMBOL_IS_NOT_A_TYPE", { templating: { symbol: symbol.getName() }});
      return false;
    }

    return true;
  }
}
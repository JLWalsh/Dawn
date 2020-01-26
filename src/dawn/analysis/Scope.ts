import {Type} from "@dawn/analysis/types/Type";
import {SymbolAlreadyDefinedError} from "@dawn/analysis/errors/SymbolAlreadyDefinedError";
import {ObjectType} from "@dawn/analysis/types/ObjectType";

export namespace Scope {

  export interface ScopeData {
    variables: Map<string, Type>;
    types: Map<string, ObjectType>;
    // Other modules
    namedChildScopes: Map<string, ScopeData>;
    parent?: ScopeData;
  }

  export function createDefaultScope(): ScopeData {
    return {
      variables: new Map(),
      types: new Map(),
      namedChildScopes: new Map(),
    };
  }

  export function createAsChildOf(parent: ScopeData): ScopeData {
    return {
      variables: new Map(),
      types: new Map(),
      namedChildScopes: new Map(),
      parent,
    };
  }

  export function createAsNamedChildOf(parent: ScopeData, scopeName: string): ScopeData {
    if (parent.namedChildScopes.has(scopeName)) {
      throw new SymbolAlreadyDefinedError(scopeName);
    }

    const childScope = createAsChildOf(parent);
    parent.namedChildScopes.set(scopeName, childScope);

    return childScope;
  }

  export function lookup(variableName: string, scope: ScopeData): Type | void {
    const variable = scope.variables.get(variableName);
    if (variable) {
      return variable;
    }

    if (scope.parent) {
      return lookup(variableName, scope.parent);
    }
  }

  export function define(scope: ScopeData, variableName: string, variableType: Type) {
    if (scope.variables.has(variableName)) {
      throw new SymbolAlreadyDefinedError(variableName);
    }

    scope.variables.set(variableName, variableType);
  }
}
import {Type} from "@dawn/analysis/types/Type";
import {VariableAlreadyDefinedError} from "@dawn/analysis/errors/VariableAlreadyDefinedError";
import {ObjectType} from "@dawn/analysis/types/ObjectType";

export namespace Scope {

  export interface ScopeData {
    variables: Map<string, Type>;
    types: Map<string, ObjectType>;
    // Other modules
    namedChildScopes: Map<string, ScopeData>;
    parent?: ScopeData;
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
      throw new VariableAlreadyDefinedError(variableName);
    }

    scope.variables.set(variableName, variableType);
  }
}
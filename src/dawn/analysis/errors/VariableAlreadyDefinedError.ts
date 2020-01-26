
export class VariableAlreadyDefinedError extends Error {

  constructor(
    public readonly variableAlreadyDefined: string,
  ) {
    super();
  }
};
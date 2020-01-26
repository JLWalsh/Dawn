
export class SymbolAlreadyDefinedError extends Error {

  constructor(
    public readonly symbolAlreadyDefined: string,
  ) {
    super();
  }
};
import {DiagnosticTemplateValues} from "@dawn/ui/DiagnosticReporter";

export class ParseError extends Error {

  constructor(
    public readonly diagnosticCode: string,
    public readonly diagnosticTemplateValues?: DiagnosticTemplateValues,
  ) { super() }

}
import {DiagnosticTemplateValues} from "@dawn/ui/DiagnosticReporter";
import {Token} from "@dawn/parsing/Token";

export class ParseError {

  constructor(
    public readonly diagnosticCode: string,
    public readonly concernedToken?: Token,
    public readonly diagnosticTemplateValues?: DiagnosticTemplateValues,
  ) {}

}

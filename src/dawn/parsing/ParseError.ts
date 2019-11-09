import {DiagnosticTemplateValues} from "@dawn/ui/DiagnosticReporter";
import {ProgramLocation} from "@dawn/ui/ProgramLocation";

export class ParseError extends Error {

  constructor(
    public readonly diagnosticCode: string,
    public readonly location: ProgramLocation,
    public readonly diagnosticTemplateValues?: DiagnosticTemplateValues,
  ) { super() }

}

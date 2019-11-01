import {DiagnosticReporter, DiagnosticTemplateValues} from "@dawn/ui/DiagnosticReporter";

export class NullDiagnosticReporter implements DiagnosticReporter {

  report(messageCode: string, templatedValues?: DiagnosticTemplateValues): void {}

  reportRaw(rawMessage: string): void {}

}
import {DiagnosticMeta, DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
import {DiagnosticSeverity} from "@dawn/ui/Diagnostic";
import {AssembledDiagnostic} from "@dawn/ui/DiagnosticMessageAssembler";

export class NullDiagnosticReporter implements DiagnosticReporter {

  reportRaw(rawMessage: string): void {}

  getWithSeverityOf(severity: DiagnosticSeverity): AssembledDiagnostic[] {
    return [];
  }

  report(messageCode: string, meta?: DiagnosticMeta): void {
  }

}

import {ProgramLocation} from "@dawn/ui/ProgramLocation";
import {DiagnosticSeverity} from "@dawn/ui/Diagnostic";
import {AssembledDiagnostic} from "@dawn/ui/DiagnosticMessageAssembler";

export interface DiagnosticTemplateValues {
  [key: string]: string | number;
}

export interface DiagnosticMeta {
  templating?: DiagnosticTemplateValues;
  location?: ProgramLocation;
}

export type DiagnosticCode = string;

export interface DiagnosticReporter {
  report(messageCode: DiagnosticCode, meta?: DiagnosticMeta): void;
  reportRaw(rawMessage: string, severity: DiagnosticSeverity): void;
  getWithSeverityOf(severity: DiagnosticSeverity): AssembledDiagnostic[];
}

import {ProgramLocation} from "@dawn/ui/ProgramLocation";

export interface DiagnosticTemplateValues {
  [key: string]: string | number;
}

export interface DiagnosticMeta {
  templating?: DiagnosticTemplateValues;
  location?: ProgramLocation;
}

export interface DiagnosticReporter {
  report(messageCode: string, meta?: DiagnosticMeta): void;
  reportRaw(rawMessage: string): void;
}

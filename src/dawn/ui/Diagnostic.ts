export enum DiagnosticLevel {
  WARN = "warn",
  ERROR = "error"
}

export interface DiagnosticFile {
  templates: Diagnostic[];
}

export interface Diagnostic {
  code: string;
  message: string;
  level: DiagnosticLevel
}

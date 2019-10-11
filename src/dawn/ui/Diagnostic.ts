export enum DiagnosticLevel {
  WARN = "warn",
  ERROR = "error"
}

export interface DiagnosticTemplate {
  code: string;
  message: string;
  level: DiagnosticLevel
}
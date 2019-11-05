
export interface DiagnosticTemplateValues {
  [key: string]: string | number;
}

export interface DiagnosticReporter {
  report(messageCode: string, templatedValues?: DiagnosticTemplateValues): void;
  reportRaw(rawMessage: string): void;
}

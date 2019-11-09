import {DiagnosticReporter, DiagnosticTemplateValues} from "@dawn/ui/DiagnosticReporter";

export class InMemoryDiagnosticReporter implements DiagnosticReporter {

  private readonly reports: string[] = [];

  report(messageCode: string, templatedValues?: DiagnosticTemplateValues): void {
    this.reports.push(messageCode);
  }

  reportRaw(rawMessage: string): void {
    this.reports.push(rawMessage);
  }

  getReports() {
    return this.reports;
  }
}

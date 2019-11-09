import {DiagnosticCode, DiagnosticMeta, DiagnosticReporter,} from "@dawn/ui/DiagnosticReporter";
import {AssembledDiagnostic, DiagnosticMessageAssembler} from "@dawn/ui/DiagnosticMessageAssembler";
import {DiagnosticSeverity} from "@dawn/ui/Diagnostic";

export class InMemoryDiagnosticReporter implements DiagnosticReporter {

  private readonly errors: AssembledDiagnostic[] = [];
  private readonly warnings: AssembledDiagnostic[] = [];

  constructor(
    private readonly diagnosticMessageAssembler: DiagnosticMessageAssembler,
  ) {}

  report(diagnosticCode: DiagnosticCode, meta: DiagnosticMeta = {}): void {
    const assembledDiagnostic = this.diagnosticMessageAssembler.assemble(diagnosticCode, meta);
    this.logDiagnostic(assembledDiagnostic);
  }

  reportRaw(message: string, severity: DiagnosticSeverity): void {
    this.logDiagnostic({ message, severity });
  }

  getErrors() {
    return this.errors;
  }

  getWithSeverityOf(severity: DiagnosticSeverity): AssembledDiagnostic[] {
    if (severity === DiagnosticSeverity.WARN) {
      return this.warnings;
    }

    return this.errors;
  }

  private logDiagnostic(diagnostic: AssembledDiagnostic) {
    if (diagnostic.severity === DiagnosticSeverity.ERROR) {
      this.errors.push(diagnostic);
      return;
    }

    this.warnings.push(diagnostic);
  }
}

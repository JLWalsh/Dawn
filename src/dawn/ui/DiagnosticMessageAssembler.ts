import ejs from 'ejs';
import {DiagnosticCode, DiagnosticMeta} from "@dawn/ui/DiagnosticReporter";
import {DiagnosticSeverity} from "@dawn/ui/Diagnostic";
import {ProgramLocation} from "@dawn/ui/ProgramLocation";

export interface AssembledDiagnostic {
  message: string;
  severity: DiagnosticSeverity;
}


interface Diagnostics {
  [key: string]: {
    message: string;
    severity: string;
  }
}

interface DiagnosticsFile {
  templates: Diagnostics;
}

export class DiagnosticMessageAssembler  {

  public static usingDiagnosticFiles(...diagnostics: DiagnosticsFile[]) {
    const mergedDiagnostics = diagnostics
      .reduce<Diagnostics>((accDiagnostics, file) => ({ ...accDiagnostics, ...file.templates }), {});

    return new DiagnosticMessageAssembler(mergedDiagnostics);
  }

  constructor(
    private readonly diagnostics: Diagnostics
  ) {}

  assemble(diagnosticCode: string, meta: DiagnosticMeta): AssembledDiagnostic {
    const diagnostic = this.diagnostics[diagnosticCode];
    if (!diagnostic) {
      throw new Error(`Diagnostic not found: ${diagnosticCode}`);
    }

    const renderedMessage = ejs.render(diagnostic.message, meta.templating);
    const message = meta.location ? this.generateLocationPrefix(meta.location) + renderedMessage : renderedMessage;

    return { message, severity: diagnostic.severity as DiagnosticSeverity };
  }

  private generateLocationPrefix(location: ProgramLocation): string {
    if (location.span) {
      return `[${location.row}:${location.column}, ${location.span} next chars] `;
    }

    return `[${location.row}:${location.column}] `;
  }
}


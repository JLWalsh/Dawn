// Ensures that no duplicate diagnostics exist
import fs from 'fs';
import {Diagnostic, DiagnosticFile} from "@dawn/ui/Diagnostic";

function findDuplicatedDiagnostics(diagnosticsPath: string) {
  const diagnostics = JSON.parse(fs.readFileSync(diagnosticsPath, 'utf-8')) as DiagnosticFile;

  const existingCodes: string[] = [];

  return diagnostics.templates.filter(d => {
    if (existingCodes.includes(d.code)) {
      return true;
    }

    existingCodes.push(d.code);
    return false;
  });
}

const diagnosticsPath = process.argv[2];
if (!diagnosticsPath) {
  console.error('Usage: node checkDiagnostics.ts [diagnosticsFilePath]');
  process.exit(1);
}

const duplicatedDiagnostics = findDuplicatedDiagnostics(diagnosticsPath);
if (duplicatedDiagnostics.length === 0) {
  console.log('No duplicated diagnostics were found.');
  process.exit(0);
}

console.log('Found duplicated diagnostics: ');
console.log(duplicatedDiagnostics);
process.exit(1);

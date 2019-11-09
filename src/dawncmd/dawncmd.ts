import 'module-alias/register';
import {tokenize} from "@dawn/parsing/Tokenizer";
import {StringIterableReader} from "@dawn/parsing/StringIterableReader";
import {Token, TokenType} from "@dawn/parsing/Token";
import {parse} from "@dawn/parsing/Parser";
import {TokenReader} from "@dawn/parsing/TokenReader";
import {InMemoryDiagnosticReporter} from "./InMemoryDiagnosticReporter";
import {Program} from "@dawn/lang/ast/Program";
import {SymbolParser} from "@dawn/analysis/SymbolParser";
import {ModuleSymbol} from "@dawn/analysis/symbols/ModuleSymbol";
import {SymbolDumper} from "./ui/SymbolDumper";
import {Compilation} from "@dawn/analysis/Compilation";
import {SymbolResolver} from "@dawn/analysis/SymbolResolver";
import {JavascriptEmitter} from "@dawn/emission/javascript/JavascriptEmitter";
import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
import {DiagnosticSeverity} from "@dawn/ui/Diagnostic";
import parserDiagnostics from '../dawn/ui/diagnostics/parserDiagnostics.json';
import tokenizerDiagnostics from '../dawn/ui/diagnostics/tokenizerDiagnostics.json';
import {DiagnosticMessageAssembler} from "@dawn/ui/DiagnosticMessageAssembler";

const fs = require('fs');
const command = process.argv[2];
const diagnosticMessageAssembler = DiagnosticMessageAssembler.usingDiagnosticFiles(parserDiagnostics, tokenizerDiagnostics);

if (command === 'tokenize') {
  const file = process.argv[3];
  if (!file) {
    console.error("Usage: dawncmd tokenize [file]");
    process.exit(1);
  }

  const fileContents = fs.readFileSync(file, 'utf-8');
  tokenizeProgram(fileContents);
}

if (command === 'parse') {
  const file = process.argv[3];
  if (!file) {
    console.error("Usage: dawncmd parse [file]");
    process.exit(1);
  }

  const fileContents = fs.readFileSync(file, 'utf-8');
  const diagnosticReporter = new InMemoryDiagnosticReporter(diagnosticMessageAssembler);
  const tokenization = tokenize(new StringIterableReader(fileContents), diagnosticReporter);

  if (diagnosticReporter.getErrors().length > 0) {
    console.error("Syntax errors were found, aborting");
    process.exit(1);
  }

  parseProgram(tokenization);
}

if (command === 'parse-symbols') {
  const file = process.argv[3];
  if (!file) {
    console.error("Usage: dawncmd parse-symbols [file]");
    process.exit(1);
  }

  const fileContents = fs.readFileSync(file, 'utf-8');
  const tokenization = tokenizeProgram(fileContents);
  const program = parseProgram(tokenization);

  parseSymbols(program);
}

if (command === 'compile-js') {
  const file = process.argv[3];
  if (!file) {
    console.error("Usage: dawncmd compile-js [file]");
    process.exit(1);
  }

  const fileContents = fs.readFileSync(file, 'utf-8');
  const tokens = tokenizeProgram(fileContents);
  const program = parseProgram(tokens);

  const globalModule = parseSymbols(program);
  const compilation = new Compilation(globalModule, program, new SymbolResolver());

  console.log("------= Compiled Program =------");
  console.log(new JavascriptEmitter().emit(compilation));
}

function tokenizeProgram(fileContents: string) {
  const diagnosticReporter = new InMemoryDiagnosticReporter(diagnosticMessageAssembler);
  const tokens = tokenize(new StringIterableReader(fileContents), diagnosticReporter);
  const tokensWithNamedTypes = tokens.map(t => ({ ...t, type: TokenType[t.type] }));

  console.log("------= Tokens =------");
  console.log(JSON.stringify(tokensWithNamedTypes));

  logDiagnosticsOf(diagnosticReporter);

  return tokens;
}

function parseProgram(tokens: Token[]): Program {
  const reporter = new InMemoryDiagnosticReporter(diagnosticMessageAssembler);
  const parsedProgram = parse(new TokenReader(tokens), reporter);

  console.log("------= Parsed program =------");
  console.log(JSON.stringify(parsedProgram.body));

  logDiagnosticsOf(reporter);

  return parsedProgram;
}

function parseSymbols(program: Program): ModuleSymbol {
  const reporter = new InMemoryDiagnosticReporter(diagnosticMessageAssembler);
  const globalSymbols = new SymbolParser().parseAllSymbols(program, reporter);

  console.log("------= Parsed symbols =------");
  console.log(SymbolDumper.dumpToString(globalSymbols));
  logDiagnosticsOf(reporter);

  return globalSymbols;
}

function logDiagnosticsOf(reporter: DiagnosticReporter) {
  console.log("------= Errors =------");
  reporter
    .getWithSeverityOf(DiagnosticSeverity.ERROR)
    .forEach(a => console.error(a.message));

  console.log("------= Warnings =------");
  reporter
    .getWithSeverityOf(DiagnosticSeverity.WARN)
    .forEach(a => console.error(a.message));
}


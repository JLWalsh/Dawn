import 'module-alias/register';
import {Tokenization, tokenize} from "@dawn/parsing/Tokenizer";
import {StringIterableReader} from "@dawn/parsing/StringIterableReader";
import {TokenType} from "@dawn/parsing/Token";
import {parse} from "@dawn/parsing/Parser";
import {TokenReader} from "@dawn/parsing/TokenReader";
import {InMemoryDiagnosticReporter} from "./InMemoryDiagnosticReporter";
import {Program} from "@dawn/lang/ast/Program";
import {SymbolParser} from "@dawn/analysis/SymbolParser";
import {ModuleSymbol} from "@dawn/analysis/symbols/ModuleSymbol";
import {SymbolDumper} from "./ui/SymbolDumper";

const fs = require('fs');
const command = process.argv[2];

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
  const tokenization = tokenize(new StringIterableReader(fileContents));
  if (tokenization.errors.length > 0) {
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
  const tokenization = tokenize(new StringIterableReader(fileContents));
  if (tokenization.errors.length > 0) {
    throw new Error("Syntax errors were found, aborting");
  }

  const program = parseProgram(tokenization);
  if (!program) {
    throw new Error("Errors were found when parsing, aborting");
  }

  parseSymbols(program);
}

function tokenizeProgram(fileContents: string) {
  const tokenization = tokenize(new StringIterableReader(fileContents));
  const tokensWithNamedTypes = tokenization.tokens.map(t => ({ ...t, type: TokenType[t.type] }));

  console.log("------= Tokens =------");
  console.log(JSON.stringify(tokensWithNamedTypes));

  console.log("------= Errors =------");
  console.log(JSON.stringify(tokenization.errors));

  return tokenization;
}

function parseProgram(tokenization: Tokenization): Program | void {
  const reporter = new InMemoryDiagnosticReporter();
  const parsedProgram = parse(new TokenReader(tokenization.tokens), reporter);

  console.log("------= Parsed program =------");
  console.log(JSON.stringify(parsedProgram.body));

  console.log("------= Errors =------");
  console.log(JSON.stringify(reporter.getReports()));

  if (reporter.getReports().length > 0) {
    return;
  }

  return parsedProgram;
}

function parseSymbols(program: Program): ModuleSymbol {
  const reporter = new InMemoryDiagnosticReporter();
  const globalSymbols = new SymbolParser().parseAllSymbols(program, reporter);

  console.log("------= Parsed symbols =------");
  console.log(SymbolDumper.dumpToString(globalSymbols));
  console.log("------= Errors =------");
  console.log(JSON.stringify(reporter.getReports()));

  return globalSymbols;
}

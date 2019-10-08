import 'module-alias/register';
import {tokenize} from "@dawn/parsing/Tokenizer";
import {StringIterableReader} from "@dawn/parsing/StringIterableReader";
import {TokenType} from "@dawn/parsing/Token";
import {parse} from "@dawn/parsing/Parser";
import {TokenReader} from "@dawn/parsing/TokenReader";

const fs = require('fs');
const command = process.argv[2];

if (command === 'tokenize') {
  const file = process.argv[3];
  if (!file) {
    console.error("Usage: dawncmd tokenize [file]");
    process.exit(1);
  }

  const fileContents = fs.readFileSync(file, "utf-8");
  const tokenization = tokenize(new StringIterableReader(fileContents));
  const tokensWithNamedTypes = tokenization.tokens.map(t => ({ ...t, type: TokenType[t.type] }));

  console.log("------= Tokens =------");
  console.log(JSON.stringify(tokensWithNamedTypes));

  console.log("------= Errors =------");
  console.log(JSON.stringify(tokenization.errors));
}

if (command === 'parse') {
  const file = process.argv[3];
  if (!file) {
    console.error("Usage: dawncmd parse [file]");
    process.exit(1);
  }

  const fileContents = fs.readFileSync(file, "utf-8");
  const tokenization = tokenize(new StringIterableReader(fileContents));
  if (tokenization.errors.length > 0) {
    console.error("Syntax errors were found, aborting");
    process.exit(1);
  }
  const parsedProgram = parse(new TokenReader(tokenization.tokens));

  console.log("------= Parsed program =------");
  console.log(JSON.stringify(parsedProgram.program));

  console.log("------= Errors =------");
  console.log(JSON.stringify(parsedProgram.errors));
}

import 'module-alias/register';
import fs from 'fs';
import {tokenize} from "@dawn/parsing/Tokenizer";
import {StringIterableReader} from "@dawn/parsing/StringIterableReader";
import {parse} from "@dawn/parsing/Parser";
import {TokenReader} from "@dawn/parsing/TokenReader";

const program = fs.readFileSync("example.dawn", "utf-8");

const { tokens, errors } = tokenize(new StringIterableReader(program));

if (errors.length > 0) {
  console.error("Errors found in program");
  console.error(JSON.stringify(errors));
  process.exit(1);
}

const output = parse(new TokenReader(tokens));

console.log(JSON.stringify(output));

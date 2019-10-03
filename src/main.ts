import 'module-alias/register';
import fs from 'fs';
import {tokenize} from "@dawn/parsing/Tokenizer";

const program = fs.readFileSync("example.dawn", "utf-8");

const { tokens, errors } = tokenize(program);

console.log("TOKENS");
console.log(JSON.stringify(tokens));
console.log("ERRORS");
console.error(JSON.stringify(errors));

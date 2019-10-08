import {TokenReader} from "@dawn/parsing/TokenReader";
import {tokenize} from "@dawn/parsing/Tokenizer";
import {StringIterableReader} from "@dawn/parsing/StringIterableReader";
import {Program, ProgramContent} from "@dawn/lang/ast/Program";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";
import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {parse} from "@dawn/parsing/Parser";
import {Return} from "@dawn/lang/ast/Return";
import {Literal} from "@dawn/lang/ast/Literal";
import {NativeType} from "@dawn/lang/NativeType";
import ast from "@dawn/lang/ast/builder/Ast";
import {Token} from "@dawn/parsing/Token";

describe('Parser', () => {
  it('should parse function declaration', () => {
    const program = parseProgram`
testFunction() {
  return 10i
}
    `;

    const expected = ast.functionDeclaration('testFunction', [], undefined, [
      ast.return(
        ast.literal(
          10,
          NativeType.INT,
        ),
      ),
    ]);

    assert(program, expected);
  });

  function assert(output: { program: Program }, nodes: ProgramContent[] | ProgramContent) {
    const body = Array.isArray(nodes) ? nodes : [nodes];

    const expectedNodes: Program = { body };

    expect(output.program).toEqual(expectedNodes);
  }
});

function parseProgram(template: TemplateStringsArray) {
  const program = template.join('\n');
  const tokens = tokenize(new StringIterableReader(program));
  if (tokens.errors.length > 0) {
    throw new Error("Syntax error (s) "+ JSON.stringify(tokens.errors));
  }

  return parse(new TokenReader(tokens.tokens));
}

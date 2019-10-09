import {TokenReader} from "@dawn/parsing/TokenReader";
import {tokenize} from "@dawn/parsing/Tokenizer";
import {StringIterableReader} from "@dawn/parsing/StringIterableReader";
import {Program, ProgramContent} from "@dawn/lang/ast/Program";
import {parse} from "@dawn/parsing/Parser";
import {NativeType} from "@dawn/lang/NativeType";
import ast from "@dawn/lang/ast/builder/Ast";

describe('Parser', () => {
  describe('function declaration', () => {
    it('should parse function declaration', () => {
      const program = parseProgram`
testFunction() {
  val x = 10i
  return x
}
    `;

      const expected =
        ast.functionDeclaration('testFunction', [], null, [
          ast.valDeclaration('x', ast.literal(10, NativeType.INT)),
          ast.return(
            ast.valAccessor(ast.accessor('x')),
          ),
        ]);

      expectProgramEquals(program, expected);
    });

    it('should parse function with one argument', () => {
      const program = parseProgram`
testFunction(one: int): float {
  return 10i
}
    `;

      const expected =
        ast.functionDeclaration('testFunction', [{ valueName: 'one', valueType: 'int' }], 'float', [
          ast.return(
            ast.literal(
              10,
              NativeType.INT,
            ),
          ),
        ]);

      expectProgramEquals(program, expected);
    });

    it('should parse function with multiple arguments', () => {
      const program = parseProgram`
testFunction(one: int, two: float, three: int) {
  return 10i
}
    `;

      const expected =
        ast.functionDeclaration('testFunction',
          [{ valueName: 'one', valueType: 'int' }, { valueName: 'two', valueType: 'float'}, { valueName: 'three', valueType: 'int' }], null, [
          ast.return(
            ast.literal(
              10,
              NativeType.INT,
            ),
          ),
        ]);

      expectProgramEquals(program, expected);
    });
  });

  function expectProgramEquals(output: { program: Program, errors: string[] }, nodes: ProgramContent[] | ProgramContent) {
    const body = Array.isArray(nodes) ? nodes : [nodes];

    const expectedNodes: Program = { body };

    expect(output.program).toEqual(expectedNodes);
    expect(output.errors).toEqual([]);
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

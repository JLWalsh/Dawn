import {TokenReader} from "@dawn/parsing/TokenReader";
import {tokenize} from "@dawn/parsing/Tokenizer";
import {StringIterableReader} from "@dawn/parsing/StringIterableReader";
import {Program, ProgramContent} from "@dawn/lang/ast/Program";
import {parse} from "@dawn/parsing/Parser";
import {NativeType} from "@dawn/lang/NativeType";
import ast from "@dawn/lang/ast/builder/Ast";
import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
import {Statement} from "@dawn/lang/ast/Statement";
import {NullDiagnosticReporter} from "@dawn/ui/NullDiagnosticReporter";

describe('Parser', () => {

  let diagnosticReporter: DiagnosticReporter = new NullDiagnosticReporter();

  beforeEach(() => {
    diagnosticReporter.report = jest.fn();
    diagnosticReporter.reportRaw = jest.fn();
  });

  describe('expressions', () => {
    it('should parse invocation', () => {
      const program = parseInFunctionBody`printSomething(10i, nested(), bob)`;

      const expectedProgram =
        parseInFunctionBody.createExpectedProgram(
          ast.valAccessor(ast.accessor('printSomething'),
            ast.invocation([
              ast.literal(10, NativeType.INT),
              ast.valAccessor(ast.accessor('nested'), ast.invocation()),
              ast.valAccessor(ast.accessor('bob')),
            ])
          )
        );

      expectProgramEquals(program, expectedProgram);
    });
  });

  describe('val declaration', () => {
    it('should parse val declaration with invocation', () => {
      const program = parseInFunctionBody`val xyz = functionCall()`;

      const expectedProgram =
        parseInFunctionBody.createExpectedProgram(
          ast.valDeclaration('xyz',
            ast.valAccessor(
              ast.accessor('functionCall'),
              ast.invocation([])
            )
          )
        );

      expectProgramEquals(program, expectedProgram);
    });

    it('should parse val declaration with instantiation', () => {
      const program = parseInFunctionBody`
      val bobval = Bob { 20i, 33i }
      `;

      const expectedProgram =
        parseInFunctionBody.createExpectedProgram(
          ast.valDeclaration('bobval',
            ast.instantiation(
              ast.accessor('Bob'),
              [
                ast.literal(20, NativeType.INT),
                ast.literal(33, NativeType.INT),
              ],
            ),
          )
        );

      expectProgramEquals(program, expectedProgram);
    });
  });

  describe('import', () => {
    it('should parse import', () => {
      const program = parseProgram`import one`;

      const expectedProgram = ast.import(ast.accessor('one'));

      expectProgramEquals(program, expectedProgram);
    });

    it('should parse submodule import', () => {
      const program = parseProgram`import one.three.two`;

      const expectedProgram = ast.import(
        ast.accessor('one',
          ast.accessor('three',
            ast.accessor('two')
          )
        )
      );

      expectProgramEquals(program, expectedProgram);
    });
  });

  describe('object declaration', () => {
    it('should parse declaration', () => {
      const program = parseProgram`
        object TestObject {
          intValue: int,
          otherValue: other
        }
      `;

      const expectedProgram =
        ast.objectDeclaration('TestObject', [
          { name: 'intValue', type: 'int' },
          { name: 'otherValue', type: 'other' },
        ]);

      expectProgramEquals(program, expectedProgram);
    });
  });

  describe('module declaration', () => {
    it('should parse empty module', () => {
      const program = parseProgram`
        module test {}
      `;

      const expected = ast.moduleDeclaration('test', []);

      expectProgramEquals(program, expected);
    });

    it('should parse module with multiple declarations', () => {
      const program = parseProgram`
        module test {
          export val X = 20i
          
          object TestObject {}
        } 
      `;

      const expected =
        ast.moduleDeclaration('test', [
          ast.export(
            ast.valDeclaration('X',
              ast.literal(20, NativeType.INT)
            ),
          ),
          ast.objectDeclaration('TestObject', []),
        ]);
    });
  });

  describe('function declaration', () => {
    it('should parse function declaration without return type', () => {
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
        ast.functionDeclaration('testFunction', [{ valueName: 'one', valueType: ast.accessor('int') }], ast.accessor('float'), [
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
testFunction(one: int, two: float, three: somemodule.AnObject) {
  return 10i
}
    `;

      const expected =
        ast.functionDeclaration('testFunction',
          [
            { valueName: 'one', valueType: ast.accessor('int') },
            { valueName: 'two', valueType: ast.accessor('float') },
            { valueName: 'three', valueType: ast.accessor('somemodule', ast.accessor('AnObject')) }], null, [
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

  function expectProgramEquals(program: Program, nodes: ProgramContent[] | ProgramContent) {
    const body = Array.isArray(nodes) ? nodes : [nodes];

    const expectedNodes: Program = { body };

    expect(diagnosticReporter.reportRaw).not.toHaveBeenCalled();
    expect(diagnosticReporter.report).not.toHaveBeenCalled();
    expect(JSON.stringify(program)).toEqual(JSON.stringify(expectedNodes));
  }

  function parseInFunctionBody(template: TemplateStringsArray) {
    const program = `aFunction() { ${template.join('\n')} }`;

    return parse(new TokenReader(tokenizeProgram(program)), diagnosticReporter);
  }

  parseInFunctionBody.createExpectedProgram = (statements: Statement) =>
    ast.functionDeclaration('aFunction', [], null, [statements]);

  function parseProgram(template: TemplateStringsArray) {
    const program = template.join('\n');

    return parse(new TokenReader(tokenizeProgram(program)), diagnosticReporter);
  }

  function tokenizeProgram(program: string) {
    return tokenize(new StringIterableReader(program), diagnosticReporter);
  }

});


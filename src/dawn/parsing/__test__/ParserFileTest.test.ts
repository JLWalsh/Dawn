import fs from 'fs';
import path from 'path';
import {Program} from "@dawn/lang/ast/Program";
import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
import {parse} from "@dawn/parsing/Parser";
import {TokenReader} from "@dawn/parsing/TokenReader";
import {tokenize} from "@dawn/parsing/Tokenizer";
import {StringIterableReader} from "@dawn/parsing/StringIterableReader";
import ast from "@dawn/lang/ast/builder/Ast";
import {BinaryOperator} from "@dawn/lang/ast/expressions/BinaryExpression";
import {PrimitiveType} from "@dawn/lang/PrimitiveType";
import {NullDiagnosticReporter} from "@dawn/ui/NullDiagnosticReporter";

describe('Parser file test', () => {

  const PROGRAM_PATH = './resources/ParserTest.dawn';

  let program: string;
  let diagnosticReporter: DiagnosticReporter = new NullDiagnosticReporter();

  beforeAll(() => {
    const programPath = path.join(__dirname, PROGRAM_PATH);
    program = fs.readFileSync(programPath, 'utf-8');
    diagnosticReporter.report = jest.fn();
    diagnosticReporter.reportRaw = jest.fn();
  });

  it('should parse the program without any errors', () => {
    const parsedProgram = parseProgram(program);

    const expectedProgram: Program = {
      body: [
        ast.import(ast.accessor('io')),

        ast.moduleDeclaration('Shapes', [
          // val PI = 3.1516f
          ast.valDeclaration('PI',
            ast.literal(3.1416, PrimitiveType.FLOAT),
          ),

          // export object Rectangle { ... }
          ast.export(
            ast.objectDeclaration('Rectangle', [
              { name: 'width', type: ast.accessor('int') },
              { name: 'height', type: ast.accessor('int') },
            ])
          ),

          // export object Circle { ... }
          ast.export(
            ast.objectDeclaration('Circle', [
              { name: 'radius', type: ast.accessor('int') }
            ])
          ),

          // export calculateArea(rectangle: Rectangle): float {
          ast.export(
            ast.functionDeclaration('calculateArea', [
              ast.functionDeclarationArgument('rectangle', ast.accessor('Rectangle')),
            ], ast.accessor('float'), [

              // return rectangle.width * rectangle .height
              ast.return(
                ast.binary(
                  ast.valAccessor(ast.accessor('rectangle', ast.accessor('width'))),
                  BinaryOperator.MULTIPLY,
                  ast.valAccessor(ast.accessor('rectangle', ast.accessor('height'))),
                ),
              ),
            ])
          ),

          // export calculateArea(circle: Circle): float {
          ast.export(
            ast.functionDeclaration('calculateArea', [
              ast.functionDeclarationArgument('circle', ast.accessor('Circle')),
            ], ast.accessor('float'), [

              // return naivePow(circle.radius, 2i) * PI
              ast.return(
                ast.binary(
                  ast.valAccessor(
                    // Function naivePow will be added eventually (to test the for loop parsing)
                    ast.accessor('naivePow'),
                    ast.invocation([
                      ast.valAccessor(ast.accessor('circle', ast.accessor('radius'))),
                      ast.literal(2, PrimitiveType.INT),
                    ]),
                  ),
                  BinaryOperator.MULTIPLY,
                  ast.valAccessor(ast.accessor('PI'))
                ),
              ),

            ])
          ),

        ]),

        // main()
        ast.functionDeclaration('main', [], null, [

          // val rectangle = Shapes.Rectangle { 10i, 20i }
          ast.valDeclaration('rectangle',
            ast.instantiation(ast.accessor('Shapes', ast.accessor('Rectangle')), [
              ast.literal(10, PrimitiveType.INT),
              ast.literal(20, PrimitiveType.INT),
            ]),
          ),

          // val circle = Shapes.Circle { radius: 30i }
          ast.valDeclaration('circle',
            ast.instantiation(ast.accessor('Shapes', ast.accessor('Circle')), [
              { key: 'radius', value: ast.literal(30, PrimitiveType.INT) }
            ]),
          ),

          // io.print(Shapes.calculateArea(circle))
          ast.valAccessor(
            ast.accessor('io', ast.accessor('print')),
            ast.invocation([
              ast.valAccessor(
                ast.accessor('Shapes', ast.accessor('calculateArea')),
                ast.invocation([
                  ast.valAccessor(ast.accessor('circle'))
                ])
              ),
            ]),
          ),

          // io.print(Shapes.calculateArea(rectangle))
          ast.valAccessor(
            ast.accessor('io', ast.accessor('print')),
            ast.invocation([
              ast.valAccessor(
                ast.accessor('Shapes', ast.accessor('calculateArea')),
                ast.invocation([
                  ast.valAccessor(ast.accessor('rectangle'))
                ])
              ),
            ]),
          ),

        ])
      ],
    };

    expectProgramEquals(parsedProgram, expectedProgram);
  });

  function parseProgram(rawProgram: string) {
    const tokens = tokenize(new StringIterableReader(rawProgram), diagnosticReporter);
    return parse(new TokenReader(tokens), diagnosticReporter);
  }

  function expectProgramEquals(program: Program, expected: Program) {
    expect(diagnosticReporter.reportRaw).not.toHaveBeenCalled();
    expect(diagnosticReporter.report).not.toHaveBeenCalled();
    expect(JSON.stringify(program)).toEqual(JSON.stringify(expected));
  }
});

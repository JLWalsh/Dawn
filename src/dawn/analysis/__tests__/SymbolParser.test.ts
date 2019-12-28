import {tokenize} from "@dawn/parsing/Tokenizer";
import {StringIterableReader} from "@dawn/parsing/StringIterableReader";
import {parse} from "@dawn/parsing/Parser";
import {TokenReader} from "@dawn/parsing/TokenReader";
import {NullDiagnosticReporter} from "@dawn/ui/NullDiagnosticReporter";
import {SymbolParser} from "@dawn/analysis/SymbolParser";
import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
import {ValSymbol} from "@dawn/analysis/symbols/ValSymbol";
import {FunctionSymbol, FunctionSymbolPrototype} from "@dawn/analysis/symbols/FunctionSymbol";
import {ObjectSymbol, ObjectSymbolValue} from "@dawn/analysis/symbols/ObjectSymbol";
import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
import ast from "@dawn/lang/ast/builder/Ast";
import {ExportedSymbol} from "@dawn/analysis/symbols/ExportedSymbol";
import {Scope} from "@dawn/analysis/scopes/Scope";
import {ModuleSymbol} from "@dawn/analysis/symbols/ModuleSymbol";

describe('SymbolParser', () => {
  const NO_RETURN_TYPE = null;

  const symbolParser = new SymbolParser();

  let diagnosticReporter: DiagnosticReporter;

  beforeEach(() => {
    diagnosticReporter = jest.fn() as any;
  });

  describe('given some exported symbols in module', () => {
    it('should parse exported and internal symbols in module', () => {
      const program = generateAst`
        module A {
          export val x = 10i
          
          val z = 20i
          
          export val y = 30i
        }
      `;

      const symbols = symbolParser.parseAllSymbols(program, diagnosticReporter);

      expectSymbolsContains(
        symbols,
        new ModuleSymbol('A',
          Scope.withSymbols(
            exported(new ValSymbol('x')),
            new ValSymbol('z'),
            exported(new ValSymbol('y')),
          ),
        ),
      );
    });

    it('should define all prototypes of an overloaded function', () => {
      const program = generateAst`
        module A {
          
          overloaded(a: int) {
          
          }
          
          overloaded(a: string) {
          
          }
          
        }
      `;

      const symbols = symbolParser.parseAllSymbols(program, diagnosticReporter);

      const expectedFunctionSymbol = new FunctionSymbol('overloaded');
      expectedFunctionSymbol.addPrototype(new FunctionSymbolPrototype(NO_RETURN_TYPE, [{ valueName: 'a', valueType: ast.accessor('int') }]));
      expectedFunctionSymbol.addPrototype(new FunctionSymbolPrototype(NO_RETURN_TYPE, [{ valueName: 'a', valueType: ast.accessor('string') }]));
      expectSymbolsContains(
        symbols,
        new ModuleSymbol('A',
          Scope.withSymbols(
            expectedFunctionSymbol,
          ),
        ),
      );
    });

    it('should parse an object declaration', () => {
      const program = generateAst`
        module A {
          
          object Bobby {
            intValue: int
          }         
          
        }
      `;

      const symbols = symbolParser.parseAllSymbols(program, diagnosticReporter);

      const objectSymbol = new ObjectSymbol('Bobby', [new ObjectSymbolValue('intValue', ast.accessor('int'))]);
      expectSymbolsContains(symbols,
        new ModuleSymbol('A',
          Scope.withSymbols(
            objectSymbol,
          ),
        ),
      );
    });

  });

  describe('given a function with multiple prototypes', () => {
    describe('and not all prototypes are exported', () => {
      it('should report error', () => {
        const program = generateAst`
          module A {
            
            export aFunction() {
            
            }
            
            aFunction(b: int) {
            
            }
          }
        `;
        diagnosticReporter.report = jest.fn();

        symbolParser.parseAllSymbols(program, diagnosticReporter);

        expect(diagnosticReporter.report).toHaveBeenCalledWith("INCONSISTENT_SYMBOL_VISIBLITY", expect.anything());
      });
    });
  });

  describe('given an existing symbol', () => {
    describe('when redeclaring symbol', () => {
      it('should report error', () => {
        const program = generateAst`
          val x = 10i;
          
          x() {}
        `;
        diagnosticReporter.report = jest.fn();

        symbolParser.parseAllSymbols(program, diagnosticReporter);

        expect(diagnosticReporter.report).toHaveBeenCalledWith("CANNOT_REDEFINE_SYMBOL", expect.anything());
      });
    });
  });

  function generateAst(literal: TemplateStringsArray) {
    const program = literal.join('\n');
    const tokens = tokenize(new StringIterableReader(program), new NullDiagnosticReporter());

    return parse(new TokenReader(tokens), diagnosticReporter);
  }

  function exported(symbol: ISymbol) {
    return new ExportedSymbol(symbol);
  }

  function expectSymbolsContains(symbols: Scope, symbol: ISymbol) {
    expect(symbols.getSymbol(symbol.getName())).toEqual(symbol);
  }
});

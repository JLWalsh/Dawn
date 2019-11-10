import {tokenize} from "@dawn/parsing/Tokenizer";
import {StringIterableReader} from "@dawn/parsing/StringIterableReader";
import {parse} from "@dawn/parsing/Parser";
import {TokenReader} from "@dawn/parsing/TokenReader";
import {NullDiagnosticReporter} from "@dawn/ui/NullDiagnosticReporter";
import {SymbolParser} from "@dawn/analysis/SymbolParser";
import {ModuleSymbol} from "@dawn/analysis/symbols/ModuleSymbol";
import {ISymbol, SymbolVisibility} from "@dawn/analysis/symbols/ISymbol";
import {ValSymbol} from "@dawn/analysis/symbols/ValSymbol";
import {FunctionSymbol} from "@dawn/analysis/symbols/FunctionSymbol";
import {ObjectDeclarationSymbol} from "@dawn/analysis/symbols/ObjectDeclarationSymbol";
import {ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {ObjectDeclaration} from "@dawn/lang/ast/declarations/ObjectDeclaration";
import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
import ast from "@dawn/lang/ast/builder/Ast";

describe('SymbolParser', () => {
  const symbolParser = new SymbolParser();

  let diagnosticReporter: DiagnosticReporter;
  let expectedModule: ModuleSymbol;

  beforeEach(() => {
    expectedModule = givenGlobalModule()
    diagnosticReporter = new NullDiagnosticReporter();
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

      expectModule('A', expectedModule,
        new ValSymbol(SymbolVisibility.EXPORTED, 'x'),
        new ValSymbol(SymbolVisibility.INTERNAL, 'z'),
        new ValSymbol(SymbolVisibility.EXPORTED, 'y'),
      );
      expect(symbols).toEqual(expectedModule);
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

      const functionSymbol = new FunctionSymbol(SymbolVisibility.INTERNAL, 'overloaded');
      functionSymbol.definePrototype([{ valueName: 'a', valueType: ast.accessor('int') }], null);
      functionSymbol.definePrototype([{ valueName: 'a', valueType: ast.accessor('string') }], null);
      expectModule('A', expectedModule, functionSymbol);
      expect(symbols).toEqual(expectedModule);
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

      const objectNode = (program.body[0] as ModuleDeclaration).body[0] as ObjectDeclaration;
      const objectSymbol = new ObjectDeclarationSymbol(SymbolVisibility.INTERNAL, 'Bobby', objectNode);
      expectModule('A', expectedModule, objectSymbol);
      expect(symbols).toEqual(expectedModule);
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

        expect(diagnosticReporter.report).toHaveBeenCalledWith("INCONSISTENT_FUNCTION_VISIBILITY");
      });
    });
  });

  function generateAst(literal: TemplateStringsArray) {
    const program = literal.join('\n');
    const tokens = tokenize(new StringIterableReader(program), new NullDiagnosticReporter());

    return parse(new TokenReader(tokens), diagnosticReporter);
  }

  function expectModule(name: string, parent: ModuleSymbol, ...symbols: ISymbol[]) {
    const module = new ModuleSymbol(SymbolVisibility.INTERNAL, name, parent);
    symbols.forEach(s => module.define(s.name, s));

    parent.define(name, module);
  }

  function givenGlobalModule(): ModuleSymbol {
    return new ModuleSymbol(SymbolVisibility.INTERNAL, SymbolParser.GLOBAL_MODULE_NAME);
  }
});

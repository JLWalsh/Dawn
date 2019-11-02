import {tokenize} from "@dawn/parsing/Tokenizer";
import {StringIterableReader} from "@dawn/parsing/StringIterableReader";
import {parse} from "@dawn/parsing/Parser";
import {TokenReader} from "@dawn/parsing/TokenReader";
import {NullDiagnosticReporter} from "@dawn/ui/NullDiagnosticReporter";
import {SymbolParser} from "@dawn/analysis/SymbolParser";
import {ModuleSymbol} from "@dawn/analysis/symbols/ModuleSymbol";
import {ISymbol, SymbolVisibility} from "@dawn/analysis/symbols/ISymbol";
import {ConstantSymbol} from "@dawn/analysis/symbols/ConstantSymbol";

describe('SymbolParser', () => {
  const symbolParser = new SymbolParser();

  describe('given some exported symbols in module', () => {
    it('should mark the exported symbols as exported', () => {
      const ast = generateAst`
        module A {
          export val x = 10i
          
          val z = 20i
          
          export val y = 30i
        }
      `;
      const moduleA = givenModuleWith('A',
        new ConstantSymbol(SymbolVisibility.EXPORTED, 'x'),
        new ConstantSymbol(SymbolVisibility.EXPORTED, 'z'),
        new ConstantSymbol(SymbolVisibility.EXPORTED, 'y'),
      );

      const symbols = symbolParser.parseAllSymbols(ast);

      expect(symbols).toEqual(givenGlobalModuleWith(moduleA));
    });

    it('should mark the not exported symbols as internal', () => {

    });
  });

  describe('given a function with multiple prototypes', () => {
    describe('and not all prototypes are exported', () => {
      it('should throw error', () => {

      });
    });

    describe('when two prototypes are of the same permutation of types', () => {
      it('should throw error', () => {

      });
    });
  });

  function generateAst(literal: TemplateStringsArray) {
    const program = literal.join('\n');
    const tokenization = tokenize(new StringIterableReader(program));

    return parse(new TokenReader(tokenization.tokens), new NullDiagnosticReporter());
  }

  function givenModuleWith(name: string, ...symbols: ISymbol[]): ModuleSymbol {
    const module = new ModuleSymbol(SymbolVisibility.INTERNAL, name);
    symbols.forEach(s => module.define(s.name, s));

    return module;
  }

  function givenGlobalModuleWith(...symbols: ISymbol[]): ModuleSymbol {
    const module = new ModuleSymbol(SymbolVisibility.INTERNAL, SymbolParser.GLOBAL_MODULE_NAME);
    symbols.forEach(s => module.define(s.name, s));

    return module;
  }
});

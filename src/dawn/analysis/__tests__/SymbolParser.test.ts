import {tokenize} from "@dawn/parsing/Tokenizer";
import {StringIterableReader} from "@dawn/parsing/StringIterableReader";
import {parse} from "@dawn/parsing/Parser";
import {TokenReader} from "@dawn/parsing/TokenReader";
import {NullDiagnosticReporter} from "@dawn/ui/NullDiagnosticReporter";
import {SymbolParser} from "@dawn/analysis/SymbolParser";
import {ModuleSymbol} from "@dawn/analysis/symbols/ModuleSymbol";
import {SymbolVisibility} from "@dawn/analysis/symbols/ISymbol";
import {ConstantSymbol} from "@dawn/analysis/symbols/ConstantSymbol";

describe('SymbolParser', () => {
  const symbolParser = new SymbolParser();

  it('should parse complete program', () => {
    const ast = generateAst`
      module A {
        object ObjectOfA {}
        
        module B {
          val valueOfB = 30i
          
          functionOfB() { return 10i }
          
        }
        
        functionOfA(name: string): int { return 10i }
        
        functionOfA(nameAsInt: int): int { return 10i }
      }
      
      val globalValue = 10i
      
      globalFunction() {
        
      }
    `;
    const expectedModule = new ModuleSymbol(SymbolVisibility.INTERNAL);
    expectedModule.define('globalValue', new ConstantSymbol(SymbolVisibility.INTERNAL, 'globalValue'));
    expectedModule.define('globalFunction', new );

    const globalModule = symbolParser.parseAllSymbols(ast);

    expect(globalModule).toEqual(new ModuleSymbol(SymbolVisibility.INTERNAL));
  });

  describe('given a function with multiple prototypes', () => {
    describe('and not all prototypes are exported', () => {
      it('should throw error', () => {

      });
    });
  });
  function generateAst(literal: TemplateStringsArray) {
    const program = literal.join('\n');
    const tokenization = tokenize(new StringIterableReader(program));

    return parse(new TokenReader(tokenization.tokens), new NullDiagnosticReporter());
  }
});
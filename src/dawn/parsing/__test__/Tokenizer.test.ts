import 'module-alias/register';
import {tokenize} from "@dawn/parsing/Tokenizer";
import {Token, TokenType} from "@dawn/parsing/Token";
import {StringIterableReader} from "@dawn/parsing/StringIterableReader";

describe('Tokenizer', () => {

  describe('given multiple tokens', () => {
    it('should parse multiple tokens', () => {
      test('import helloworld \n 20i-40.123f object', {
       tokens: [
         {
           type: TokenType.IMPORT,
           value: 'import',
           lexeme: 'import',
         },
         {
           type: TokenType.IDENTIFIER,
           value: 'helloworld',
           lexeme: 'helloworld',
         },
         {
           type: TokenType.INT_NUMBER,
           value: 20,
           lexeme: '20i',
         },
         {
           type: TokenType.FLOAT_NUMBER,
           value: -40.123,
           lexeme: '-40.123f',
         },
         {
           type: TokenType.OBJECT,
           value: 'object',
           lexeme: 'object',
         },
       ]
      });
    });
  });

  it('should parse an integer', () => {
    test('20i', {
      tokens: [{
        type: TokenType.INT_NUMBER,
        value: 20,
        lexeme: '20i',
      }],
    });
  });

  it('should parse a negated integer', () => {
    test('-42i', {
      tokens: [{
        type: TokenType.INT_NUMBER,
        value: -42,
        lexeme: '-42i',
      }],
    });
  });

  it('should return error when parsing an integer with decimals', () => {
    test('20.20123i', {
      errors: [
        'Int may not contain decimals',
      ],
    });
  });

  it('should parse a float', () => {
    test('20.12354f', {
      tokens: [{
        type: TokenType.FLOAT_NUMBER,
        value: 20.12354,
        lexeme: '20.12354f',
      }],
    });
  });

  it('should parse a float without decimals', () => {
    test('20f', {
      tokens: [{
        type: TokenType.FLOAT_NUMBER,
        value: 20,
        lexeme: '20f',
      }],
    });
  });

  it('should parse a negated float', () => {
    test('-42.42f', {
      tokens: [{
        type: TokenType.FLOAT_NUMBER,
        value: -42.42,
        lexeme: '-42.42f',
      }],
    });
  });

  it('should skip newlines', () => {
    test('\n10i\n', {
      tokens: [{
        type: TokenType.INT_NUMBER,
        value: 10,
        lexeme: '10i',
      }],
    });
  });

  it('should skip line returns', () => {
    test('\r10i\r', {
      tokens: [{
        type: TokenType.INT_NUMBER,
        value: 10,
        lexeme: '10i',
      }],
    });
  });

  it('should skip whitespace', () => {
    test(' 10i ', {
      tokens: [{
        type: TokenType.INT_NUMBER,
        value: 10,
        lexeme: '10i',
      }],
    });
  });

  it('should parse (', () => {
    test('(', {
      tokens: [{
        type: TokenType.PAREN_OPEN,
        lexeme: '(',
      }],
    });
  });

  it('should parse )', () => {
    test(')', {
      tokens: [{
        type: TokenType.PAREN_CLOSE,
        lexeme: ')',
      }],
    });
  });

  it('should parse {', () => {
    test('{', {
      tokens: [{
        type: TokenType.BRACKET_OPEN,
        lexeme: '{',
      }],
    });
  });

  it('should parse }', () => {
    test('}', {
      tokens: [{
        type: TokenType.BRACKET_CLOSE,
        lexeme: '}',
      }],
    });
  });

  it('should parse .', () => {
    test('.', {
      tokens: [{
        type: TokenType.DOT,
        lexeme: '.',
      }],
    });
  });

  it('should parse :', () => {
    test(':', {
      tokens: [{
        type: TokenType.COLON,
        lexeme: ':',
      }],
    });
  });

  it('should parse -', () => {
    test('-', {
      tokens: [{
        type: TokenType.HYPHEN,
        lexeme: '-',
      }],
    });
  });

  it('should parse *', () => {
    test('*', {
      tokens: [{
        type: TokenType.STAR,
        lexeme: '*',
      }],
    });
  });

  it('should parse ^', () => {
    test('^', {
      tokens: [{
        type: TokenType.UPTICK,
        lexeme: '^',
      }],
    });
  });

  it('should parse =', () => {
    test('=', {
      tokens: [{
        type: TokenType.EQUALS,
        lexeme: '=',
      }],
    });
  });

  it('should parse ,', () => {
    test(',', {
      tokens: [{
        type: TokenType.COMMA,
        lexeme: ',',
      }],
    });
  });

  it('should parse import keyword', () => {
    test('import', {
      tokens: [{
        type: TokenType.IMPORT,
        lexeme: 'import',
        value: 'import',
      }],
    });
  });

  it('should parse module keyword', () => {
    test('module', {
      tokens: [{
        type: TokenType.MODULE,
        lexeme: 'module',
        value: 'module',
      }],
    });
  });

  it('should parse export keyword', () => {
    test('export', {
      tokens: [{
        type: TokenType.EXPORT,
        lexeme: 'export',
        value: 'export',
      }],
    });
  });

  it('should parse object keyword', () => {
    test('object', {
      tokens: [{
        type: TokenType.OBJECT,
        lexeme: 'object',
        value: 'object',
      }],
    });
  });

  it('should parse val keyword', () => {
    test('val', {
      tokens: [{
        type: TokenType.VAL,
        lexeme: 'val',
        value: 'val',
      }],
    });
  });

  it('should parse return keyword', () => {
    test('return', {
      tokens: [{
        type: TokenType.RETURN,
        lexeme: 'return',
        value: 'return',
      }],
    });
  });

  function test(program: string, expected: { tokens?: Token[], errors?: string[] }) {
    const { tokens, errors } = tokenize(new StringIterableReader(program));

    if (expected.tokens) {
      expected.tokens.forEach(token => expect(tokens).toContainEqual(token));
    } else {
      expect(tokens).toEqual([]);
    }

    if(expected.errors) {
      expected.errors.forEach(error => expect(errors).toContainEqual(error));
    } else {
      expect(errors).toEqual([]);
    }
  }
});
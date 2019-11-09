import 'module-alias/register';
import {tokenize} from "@dawn/parsing/Tokenizer";
import {Token, TokenType} from "@dawn/parsing/Token";
import {StringIterableReader} from "@dawn/parsing/StringIterableReader";
import {ProgramLocation} from "@dawn/ui/ProgramLocation";
import {DiagnosticMeta} from "@dawn/ui/DiagnosticReporter";
import {NullDiagnosticReporter} from "@dawn/ui/NullDiagnosticReporter";

describe('Tokenizer', () => {
  const diagnostics = new NullDiagnosticReporter();

  beforeEach(() => {
    diagnostics.report = jest.fn();
    diagnostics.reportRaw = jest.fn();
  });

  describe('given multiple tokens', () => {
    it('should parse multiple tokens', () => {
      test('import helloworld 20i-40.123f object != - *', {
       tokens: [
         {
           type: TokenType.IMPORT,
           value: 'import',
           lexeme: 'import',
           location: locationAtColumn(1),
         },
         {
           type: TokenType.IDENTIFIER,
           value: 'helloworld',
           lexeme: 'helloworld',
           location: locationAtColumn(8),
         },
         {
           type: TokenType.INT_NUMBER,
           value: 20,
           lexeme: '20i',
           location: locationAtColumn(19),
         },
         {
           type: TokenType.FLOAT_NUMBER,
           value: -40.123,
           lexeme: '-40.123f',
           location: locationAtColumn(22),
         },
         {
           type: TokenType.OBJECT,
           value: 'object',
           lexeme: 'object',
           location: locationAtColumn(31),
         },
         {
           type: TokenType.BANG_EQUALS,
           lexeme: '!=',
           location: locationAtColumn(38),
         },
         {
           type: TokenType.HYPHEN,
           lexeme: '-',
           location: locationAtColumn(41),
         },
         {
           type: TokenType.STAR,
           lexeme: '*',
           location: locationAtColumn(43),
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
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse a negated integer', () => {
    test('-42i', {
      tokens: [{
        type: TokenType.INT_NUMBER,
        value: -42,
        lexeme: '-42i',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should report error when parsing an integer with decimals', () => {
    expectError('20.20123i', 'INT_MAY_NOT_CONTAIN_DECIMALS', { location: { row: 1, column: 1, span: 8 } });
  });

  it('should report error when parsing number without type suffix', () => {
    expectError('-90.20123', 'EXPECTED_TYPE_FOR_NUMBER', { location: { row: 1, column: 1, span: 8 } });
  });

  it('should report error when encountering a non-supported character', () => {
    expectError('©', 'UNRECOGNIZED_CHARACTER', { location: { row: 1, column: 1, span: 0 }, templating: { character: '©' } });
  });

  it('should parse a float', () => {
    test('20.12354f', {
      tokens: [{
        type: TokenType.FLOAT_NUMBER,
        value: 20.12354,
        lexeme: '20.12354f',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse a float without decimals', () => {
    test('20f', {
      tokens: [{
        type: TokenType.FLOAT_NUMBER,
        value: 20,
        lexeme: '20f',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse a negated float', () => {
    test('-42.42f', {
      tokens: [{
        type: TokenType.FLOAT_NUMBER,
        value: -42.42,
        lexeme: '-42.42f',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should change row when encountering newline', () => {
    test('\n10i\n', {
      tokens: [{
        type: TokenType.INT_NUMBER,
        value: 10,
        lexeme: '10i',
        location: { column: 1, row: 2 },
      }],
    });
  });

  it('should skip line returns', () => {
    test('\r10i\r', {
      tokens: [{
        type: TokenType.INT_NUMBER,
        value: 10,
        lexeme: '10i',
        location: locationAtColumn(2),
      }],
    });
  });

  it('should skip whitespace', () => {
    test(' 10i ', {
      tokens: [{
        type: TokenType.INT_NUMBER,
        value: 10,
        lexeme: '10i',
        location: locationAtColumn(2),
      }],
    });
  });

  it('should parse (', () => {
    test('(', {
      tokens: [{
        type: TokenType.PAREN_OPEN,
        lexeme: '(',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse )', () => {
    test(')', {
      tokens: [{
        type: TokenType.PAREN_CLOSE,
        lexeme: ')',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse {', () => {
    test('{', {
      tokens: [{
        type: TokenType.BRACKET_OPEN,
        lexeme: '{',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse }', () => {
    test('}', {
      tokens: [{
        type: TokenType.BRACKET_CLOSE,
        lexeme: '}',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse .', () => {
    test('.', {
      tokens: [{
        type: TokenType.DOT,
        lexeme: '.',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse :', () => {
    test(':', {
      tokens: [{
        type: TokenType.COLON,
        lexeme: ':',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse -', () => {
    test('-', {
      tokens: [{
        type: TokenType.HYPHEN,
        lexeme: '-',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse *', () => {
    test('*', {
      tokens: [{
        type: TokenType.STAR,
        lexeme: '*',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse =', () => {
    test('=', {
      tokens: [{
        type: TokenType.EQUALS,
        lexeme: '=',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse ,', () => {
    test(',', {
      tokens: [{
        type: TokenType.COMMA,
        lexeme: ',',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse import keyword', () => {
    test('import', {
      tokens: [{
        type: TokenType.IMPORT,
        lexeme: 'import',
        value: 'import',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse module keyword', () => {
    test('module', {
      tokens: [{
        type: TokenType.MODULE,
        lexeme: 'module',
        value: 'module',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse export keyword', () => {
    test('export', {
      tokens: [{
        type: TokenType.EXPORT,
        lexeme: 'export',
        value: 'export',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse object keyword', () => {
    test('object', {
      tokens: [{
        type: TokenType.OBJECT,
        lexeme: 'object',
        value: 'object',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse val keyword', () => {
    test('val', {
      tokens: [{
        type: TokenType.VAL,
        lexeme: 'val',
        value: 'val',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse return keyword', () => {
    test('return', {
      tokens: [{
        type: TokenType.RETURN,
        lexeme: 'return',
        value: 'return',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse >=', () => {
    test('>=', {
      tokens: [{
        type: TokenType.GREATER_OR_EQUAL,
        lexeme: '>=',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse >', () => {
    test('>', {
      tokens: [{
        type: TokenType.GREATER_THAN,
        lexeme: '>',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse <=', () => {
    test('<=', {
      tokens: [{
        type: TokenType.LESS_OR_EQUAL,
        lexeme: '<=',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse <', () => {
    test('<', {
      tokens: [{
        type: TokenType.LESS_THAN,
        lexeme: '<',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse ==', () => {
    test('==', {
      tokens: [{
        type: TokenType.EQUALS_EQUALS,
        lexeme: '==',
        location: locationAtColumn(1),
      }],
    });
  });

  it('should parse !=', () => {
    test('!=', {
      tokens: [{
        type: TokenType.BANG_EQUALS,
        lexeme: '!=',
        location: locationAtColumn(1),
      }],
    });
  });

  function locationAtColumn(column: number): ProgramLocation {
    return { row: 1, column };
  }

  function expectError(program: string, errorCode: string, expectedErrorMeta: DiagnosticMeta) {
    tokenize(new StringIterableReader(program), diagnostics);

    expect(diagnostics.report).toHaveBeenCalledTimes(1);
    expect(diagnostics.report).toHaveBeenCalledWith(errorCode, expectedErrorMeta);
  }

  function test(program: string, expected: { tokens: Token[] }) {
    const tokens = tokenize(new StringIterableReader(program), diagnostics);

    expected.tokens.forEach(token => expect(tokens).toContainEqual(token));

    expect(diagnostics.report).not.toHaveBeenCalled();
    expect(diagnostics.reportRaw).not.toHaveBeenCalled();
  }
});

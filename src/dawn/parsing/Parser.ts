import {TokenReader} from "@dawn/parsing/TokenReader";
import {TokenType} from "@dawn/parsing/Token";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {Expression} from "@dawn/lang/ast/Expression";
import {ValAccessor} from "@dawn/lang/ast/ValAccessor";
import {Invocation} from "@dawn/lang/ast/Invocation";
import {findBinaryExpressionOperator} from "@dawn/lang/ast/expressions/BinaryExpression";
import {findComparisonOperator} from "@dawn/lang/ast/expressions/ComparisonExpression";
import {findEqualityOperator} from "@dawn/lang/ast/expressions/EqualityExpression";
import {Statement} from "@dawn/lang/ast/Statement";
import {Return} from "@dawn/lang/ast/Return";
import {FunctionArgument} from "@dawn/lang/ast/declarations/FunctionArgument";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";
import {Instantiation, KeyValue} from "@dawn/lang/ast/Instantiation";
import {ModuleContent, ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {Export} from "@dawn/lang/ast/Export";
import {Declaration} from "@dawn/lang/ast/DeclarationNode";
import {ObjectDeclaration, ObjectValue} from "@dawn/lang/ast/declarations/ObjectDeclaration";
import {Import} from "@dawn/lang/ast/Import";
import {Program, ProgramContent} from "@dawn/lang/ast/Program";
import ast from "@dawn/lang/ast/builder/Ast";
import {tokenTypeToPrimitiveType} from "@dawn/lang/PrimitiveType";
import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
import {ParseError} from "@dawn/parsing/ParseError";
import {DiagnosticSeverity} from "@dawn/ui/Diagnostic";
import {UnaryOperator} from "@dawn/lang/ast/expressions/UnaryExpression";

export function parse(reader: TokenReader, reporter: DiagnosticReporter): Program {

  function program(): Program {
    const body: ProgramContent[] = [];
    while (!reader.isAtEnd()) {
      try {
        body.push(programContent());
      } catch (error) {
        handleError(error, [TokenType.OBJECT, TokenType.MODULE, TokenType.VAL, TokenType.IDENTIFIER]);
      }
    }

    return ast.program(body);
  }

  function programContent(): ProgramContent {
    if (reader.peekType(TokenType.MODULE)) {
      return moduleDeclaration();
    } else if (reader.peekType(TokenType.OBJECT)) {
      return objectDeclaration();
    } else if (reader.peekType(TokenType.IMPORT)) {
      return importStatement();
    } else if (reader.peekType(TokenType.IDENTIFIER)) {
      return functionDeclaration();
    } else if (reader.peekType(TokenType.VAL)) {
      return valDeclaration();
    }

    if (reader.peekType(TokenType.BRACKET_CLOSE)) {
      throw new ParseError("MISSING_OPENING_BRACKET", reader.peekOrPrevious());
    }
    throw new ParseError("PROGRAM_NO_MATCHING_STATEMENT", reader.peekOrPrevious());
  }

  function declaration(): Declaration {
    if (reader.peekType(TokenType.MODULE))
      return moduleDeclaration();

    if (reader.peekType(TokenType.VAL))
      return valDeclaration();

    if (reader.peekType(TokenType.OBJECT))
      return objectDeclaration();

    if (reader.peekType(TokenType.IDENTIFIER))
      return functionDeclaration();

    throw new ParseError("EXPECTED_DECLARATION", reader.peekOrPrevious());
  }

  function objectDeclaration(): ObjectDeclaration {
    reader.consume(TokenType.OBJECT, "EXPECTED_OBJECT_DECLARATION");
    const name = reader.consume(TokenType.IDENTIFIER, "EXPECTED_OBJECT_NAME");
    reader.consume(TokenType.BRACKET_OPEN, "EXPECTED_OBJECT_BODY");

    const values = mapWithCommasUntil<ObjectValue>(TokenType.BRACKET_CLOSE, () => objectValue());

    reader.consume(TokenType.BRACKET_CLOSE, "EXPECTED_END_OF_OBJECT_DECLARATION");

    return ast.objectDeclaration(name.value as string, values);
  }

  function objectValue(): ObjectValue {
    const name = reader.consume(TokenType.IDENTIFIER, "EXPECTED_VALUE_NAME");
    reader.consume(TokenType.COLON, "EXPECTED_COLON_AFTER_VALUE_NAME");
    const type = accessor();

    return { name: name.value as string, type };
  }

  function moduleDeclaration(): ModuleDeclaration {
    reader.consume(TokenType.MODULE, "EXPECTED_MODULE_DECLARATION");
    const name = reader.consume(TokenType.IDENTIFIER, "EXPECTED_MODULE_NAME");
    reader.consume(TokenType.BRACKET_OPEN, "EXPECTED_MODULE_BODY");

    const body = mapUntil<ModuleContent>(TokenType.BRACKET_CLOSE, () => {
      try {
        if (reader.peekType(TokenType.EXPORT)) {
          return exportStatement();
        } else {
          return declaration();
        }
      } catch (error) {
        handleError(error, [TokenType.BRACKET_CLOSE, TokenType.MODULE, TokenType.VAL, TokenType.OBJECT]);
      }
    });

    reader.consume(TokenType.BRACKET_CLOSE, "EXPECTED_END_OF_MODULE_BODY");

    return ast.moduleDeclaration(name.value as string, body);
  }

  function importStatement(): Import {
    reader.consume(TokenType.IMPORT, "EXPECTED_IMPORT_STATEMENT");
    const acc = accessor();

    return ast.import(acc);
  }

  function exportStatement(): Export {
    reader.consume(TokenType.EXPORT, "EXPECTED_EXPORT_STATEMENT");
    const exported = declaration();

    return ast.export(exported);
  }

  function functionDeclaration(): FunctionDeclaration {
    const name = reader.consume(TokenType.IDENTIFIER, "EXPECTED_FUNCTION_DECLARATION");

    const args = functionArguments();

    let returnType = null;
    if (reader.match(TokenType.COLON)) {
      returnType = accessor();
    }

    const body = functionBody();

    return ast.functionDeclaration(name.value as string, args, returnType, body);
  }

  function functionArguments(): FunctionArgument[] {
    try {
      reader.consume(TokenType.PAREN_OPEN, "EXPECTED_FUNCTION_PROTOTYPE");
      const args = mapWithCommasUntil<FunctionArgument>(TokenType.PAREN_CLOSE, () => functionArgument());
      reader.consume(TokenType.PAREN_CLOSE, "EXPECTED_END_OF_FUNCTION_ARGUMENTS");

      return args;
    } catch (error) {
      handleError(error, [TokenType.BRACKET_OPEN, TokenType.MODULE, TokenType.VAL, TokenType.OBJECT]);
    }

    return [];
  }

  function functionArgument(): FunctionArgument {
    const variableName = reader.consume(TokenType.IDENTIFIER, "EXPECTED_ARGUMENT_NAME");
    reader.consume(TokenType.COLON, "EXPECTED_COLON_AFTER_ARGUMENT_NAME");
    const variableType = accessor();

    return ast.functionDeclarationArgument(variableName.value as string, variableType);
  }

  function functionBody(): Statement[]  {
    reader.consume(TokenType.BRACKET_OPEN, "EXPECTED_FUNCTION_BODY");

    const body = mapUntil<Statement>(TokenType.BRACKET_CLOSE, () => {
      try {
        return statement();
      } catch (error) {
        handleError(error, [TokenType.BRACKET_CLOSE, TokenType.RETURN, TokenType.VAL]);
      }
    });

    reader.consume(TokenType.BRACKET_CLOSE, "EXPECTED_END_OF_FUNCTION_BODY");

    return body;
  }

  function statement(): Statement {
    if (reader.peekType(TokenType.RETURN)) {
      return returnStatement();
    }

    if (reader.peekType(TokenType.VAL)) {
      return valDeclaration();
    }

    return expression();
  }

  function returnStatement(): Return {
    reader.consume(TokenType.RETURN, "EXPECTED_RETURN_STATEMENT");
    const value = expression();

    return ast.return(value);
  }

  function valDeclaration(): ValDeclaration {
    reader.consume(TokenType.VAL, "EXPECTED_VALUE_DECLARATION");
    const name = reader.consume(TokenType.IDENTIFIER, "EXPECTED_VALUE_NAME");
    reader.consume(TokenType.EQUALS, "EXPECTED_ASSIGNMENT_TO_VALUE");
    const initializer = expression();

    return ast.valDeclaration(name.value as string, initializer);
  }

  function expression(): Expression {
    return equality();
  }

  function equality(): Expression {
    let left = comparison();

    while(reader.match(TokenType.BANG_EQUALS, TokenType.EQUALS_EQUALS)) {
      const equalityToken = reader.previous();
      const operator = findEqualityOperator(equalityToken);
      const right = comparison();

      left = ast.equality(left, operator, right);
    }

    return left;
  }

  function comparison(): Expression {
    let left = addition();

    while(reader.match(TokenType.LESS_OR_EQUAL, TokenType.LESS_THAN, TokenType.GREATER_OR_EQUAL, TokenType.GREATER_THAN)) {
      const operatorToken = reader.previous();
      const operator = findComparisonOperator(operatorToken);
      const right = addition();

      left = ast.comparison(left, operator, right);
    }

    return left;
  }

  function addition(): Expression {
    let left = multiplication();

    while(reader.match(TokenType.PLUS, TokenType.HYPHEN)) {
      const operatorToken = reader.previous();
      const operator = findBinaryExpressionOperator(operatorToken);
      const right = multiplication();

      left = ast.binary(left, operator, right);
    }

    return left;
  }

  function multiplication(): Expression {
    let left = unary();

    while(reader.match(TokenType.FORWARD_SLASH, TokenType.STAR)) {
      const operatorToken = reader.previous();
      const operator = findBinaryExpressionOperator(operatorToken);
      const right = unary();

      left = ast.binary(left, operator, right);
    }

    return left;
  }

  function unary(): Expression {
    if (reader.match(TokenType.BANG, TokenType.HYPHEN)) {
      const operator = reader.previous();
      const right = unary();

      return ast.unary(operator.value as UnaryOperator, right);
    }

    return literal();
  }

  function literal(): Expression {
    if (reader.match(TokenType.PAREN_OPEN)) {
      const groupedExpression = expression();
      reader.consume(TokenType.PAREN_CLOSE, "EXPECTED_CLOSING_PARENTHESIS");

      return groupedExpression;
    }

    if (reader.peekType(TokenType.IDENTIFIER)) {
      return undefinedLiteral();
    }

    if (reader.match(TokenType.INT_NUMBER, TokenType.FLOAT_NUMBER)) {
      const token = reader.previous();
      const valueType = tokenTypeToPrimitiveType(token.type);

      return ast.literal(token.value, valueType);
    }

    throw new ParseError("NO_MATCH_FOUND_FOR_LITERAL", reader.peekOrPrevious());
  }

  function undefinedLiteral(): ValAccessor | Instantiation {
    const acc = accessor();

    if (reader.peekType(TokenType.BRACKET_OPEN)) {
      return instantiation(acc);
    }

    return valaccessor(acc);
  }

  function instantiation(objectType: Accessor): Instantiation {
    reader.consume(TokenType.BRACKET_OPEN, "EXPECTED_OBJECT_INSTANTIATION");

    let values: Expression[] | KeyValue[] = [];
    if (!reader.peekType(TokenType.BRACKET_CLOSE)) {
      if(reader.peekAt(1).type === TokenType.COLON) {
        values = keyValueInstantiation();
      } else {
        values = orderedInstantiation();
      }
    }

    reader.consume(TokenType.BRACKET_CLOSE, "EXPECTED_END_OF_OBJECT_INSTANTIATION");

    return ast.instantiation(objectType, values);
  }

  function keyValueInstantiation(): KeyValue[] {
    return mapWithCommasUntil<KeyValue>(TokenType.BRACKET_CLOSE, () => {
      const key = reader.consume(TokenType.IDENTIFIER, "EXPECTED_KEY_FOR_KEY_VALUE_INSTANTIATION");
      reader.consume(TokenType.COLON, "EXPECTED_ASSIGNMENT_FOR_KEY_VALUE_INSTANTIATION");
      const value = expression();

      return {key: key.value as string, value};
    });
  }

  function orderedInstantiation(): Expression[] {
    return mapWithCommasUntil<Expression>(TokenType.BRACKET_CLOSE, () => expression());
  }

  function valaccessor(value: Accessor): ValAccessor {
    if (reader.peekType(TokenType.PAREN_OPEN)) {
      const invoc = invocation();

      return ast.valAccessor(value, invoc);
    }

    return ast.valAccessor(value);
  }

  function invocation(): Invocation {
    reader.consume(TokenType.PAREN_OPEN, "EXPECTED_INVOCATION");

    const args = mapWithCommasUntil<Expression>(TokenType.PAREN_CLOSE, () => expression());

    reader.consume(TokenType.PAREN_CLOSE, "EXPECTED_CLOSING_PARENTHESIS");

    return ast.invocation(args);
  }

  function accessor(): Accessor {
    const name = reader.consume(TokenType.IDENTIFIER, "EXPECTED_IDENTIFIER_FOR_ACCESSOR");

    if (reader.match(TokenType.DOT)) {
      const subAccessor = accessor();

      return ast.accessor(name.value as string, subAccessor);
    }

    return ast.accessor(name.value as string);
  }

  function mapWithCommasUntil<T>(untilToken: TokenType, map: () => T | void): T[] {
    let isFirstValue = true;
    return mapUntil<T>(untilToken, () => {
      if (!isFirstValue) {
        reader.consume(TokenType.COMMA, "EXPECTED_COMMA_BETWEEN_EXPRESSIONS");
      }
      isFirstValue = false;

      return map();
    });
  }

  function mapUntil<T>(untilToken: TokenType, map: () => T | void): T[] {
    const values = [];
    while(!reader.peekType(untilToken) && !reader.isAtEnd()) {
      values.push(map());
    }

    return values.filter(v => Boolean(v)) as T[];
  }

  function handleError(error: any, tokensAllowedToRecoverTo: TokenType[]) {
    reportError(error);
    recover(tokensAllowedToRecoverTo);
  }

  function recover(tokensAllowedToRecoverTo: TokenType[]) {
    if (reader.peekType(...tokensAllowedToRecoverTo)) {
      return;
    }

    reader.advance();

    let bracketClosingsToSkip = 0;
    while(!reader.isAtEnd()) {
      if (reader.peekType(TokenType.BRACKET_OPEN))
        bracketClosingsToSkip++;

      if (reader.peekType(TokenType.BRACKET_CLOSE) && bracketClosingsToSkip > 0) {
        bracketClosingsToSkip--;
        reader.advance();
        continue;
      }

      if (reader.peekType(...tokensAllowedToRecoverTo))
        return;

      reader.advance();
    }
  }

  function reportError(error: any) {
    if (typeof error === 'string') {
      reporter.reportRaw(error, DiagnosticSeverity.ERROR);
      return;
    }

    if (error instanceof ParseError) {
      reporter.report(error.diagnosticCode, { templating: error.diagnosticTemplateValues, location: error.concernedToken && error.concernedToken.location });
      return;
    }

    reporter.reportRaw(JSON.stringify(error.message), DiagnosticSeverity.ERROR);
  }

  return program();
}

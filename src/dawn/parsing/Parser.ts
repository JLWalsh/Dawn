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
import {tokenTypeToNativeType} from "@dawn/lang/NativeType";
import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
import {ParseError} from "@dawn/parsing/ParseError";

export function parse(reader: TokenReader, reporter: DiagnosticReporter): Program {

  function program(): Program {
    const body: ProgramContent[] = [];
    while (!reader.isAtEnd()) {
      try {
        body.push(programContent());
      } catch (error) {
        reportError(error);
        recover();
      }
    }

    return ast.program(body);
  }

  function programContent(): ProgramContent {
    if (reader.peek().type === TokenType.MODULE) {
      return moduleDeclaration();
    } else if (reader.peek().type === TokenType.OBJECT) {
      return objectDeclaration();
    } else if (reader.peek().type === TokenType.IMPORT) {
      return importStatement();
    } else if (reader.peek().type === TokenType.IDENTIFIER) {
      return functionDeclaration();
    }

    throw new ParseError("PROGRAM_NO_MATCHING_STATEMENT");
  }

  function declaration(): Declaration {
    switch(reader.peek().type) {
      case TokenType.MODULE:
        return moduleDeclaration();
      case TokenType.VAL:
        return valDeclaration();
      case TokenType.OBJECT:
        return objectDeclaration();
      case TokenType.IDENTIFIER:
        return functionDeclaration();
    }

    throw new ParseError("EXPECTED_DECLARATION");
  }

  function objectDeclaration(): ObjectDeclaration {
    reader.consume(TokenType.OBJECT, "EXPECTED_OBJECT_DECLARATION");
    const name = reader.consume(TokenType.IDENTIFIER, "EXPECTED_OBJECT_NAME");
    reader.consume(TokenType.BRACKET_OPEN, "EXPECTED_OBJECT_BODY");

    const values = mapWithCommasUntil<ObjectValue>(TokenType.BRACKET_CLOSE, () => objectValue());

    reader.consume(TokenType.BRACKET_CLOSE, "EXPECTED_END_OF_OBJECT_DECLARATION");

    return ast.objectDeclaration(name.value, values);
  }

  function objectValue(): ObjectValue {
    const name = reader.consume(TokenType.IDENTIFIER, "EXPECTED_VALUE_NAME");
    reader.consume(TokenType.COLON, "EXPECTED_COLON_AFTER_VALUE_NAME");
    const type = reader.consume(TokenType.IDENTIFIER, "EXPECTED_TYPE_FOR_VALUE");

    return { name: name.value, type: type.value };
  }

  function moduleDeclaration(): ModuleDeclaration {
    reader.consume(TokenType.MODULE, "EXPECTED_MODULE_DECLARATION");
    const name = reader.consume(TokenType.IDENTIFIER, "EXPECTED_MODULE_NAME");
    reader.consume(TokenType.BRACKET_OPEN, "EXPECTED_MODULE_BODY");

    const body = mapUntil<ModuleContent>(TokenType.BRACKET_CLOSE, () => {
      if (reader.peek().type === TokenType.EXPORT) {
        return exportStatement();
      } else {
        return declaration();
      }
    });

    reader.consume(TokenType.BRACKET_CLOSE, "EXPECTED_END_OF_MODULE_BODY");

    return ast.moduleDeclaration(name.value, body);
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
    reader.consume(TokenType.PAREN_OPEN, "EXPECTED_FUNCTION_PROTOTYPE");

    const args = mapWithCommasUntil<FunctionArgument>(TokenType.PAREN_CLOSE, () => functionArgument());

    reader.consume(TokenType.PAREN_CLOSE, "EXPECTED_END_OF_FUNCTION_ARGUMENTS");

    let returnType = null;
    if (reader.match(TokenType.COLON)) {
      const returnTypeToken = reader.consume(TokenType.IDENTIFIER, "EXPECTED_FUNCTION_RETURN_TYPE");
      returnType = returnTypeToken.value;
    }

    const body = functionBody();

    return ast.functionDeclaration(name.value, args, returnType, body);
  }

  function functionArgument(): FunctionArgument {
    const variableName = reader.consume(TokenType.IDENTIFIER, "EXPECTED_ARGUMENT_NAME");
    reader.consume(TokenType.COLON, "EXPECTED_COLON_AFTER_ARGUMENT_NAME");
    const variableType = reader.consume(TokenType.IDENTIFIER, "EXPECTED_ARGUMENT_TYPE");

    return ast.functionDeclarationArgument(variableName.value, variableType.value);
  }

  function functionBody(): Statement[]  {
    reader.consume(TokenType.BRACKET_OPEN, "EXPECTED_FUNCTION_BODY");
    const body = [];

    while(reader.peek().type !== TokenType.BRACKET_CLOSE) {
      const stmt = statement();
      body.push(stmt);
    }

    reader.consume(TokenType.BRACKET_CLOSE, "EXPECTED_END_OF_FUNCTION_BODY");

    return body;
  }

  function statement(): Statement {
    if (reader.peek().type === TokenType.RETURN) {
      return returnStatement();
    }

    if (reader.peek().type === TokenType.VAL) {
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

    return ast.valDeclaration(name.value, initializer);
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

      return ast.unary(operator.value, right);
    }

    return literal();
  }

  function literal(): Expression {
    if (reader.match(TokenType.PAREN_OPEN)) {
      const groupedExpression = expression();
      reader.consume(TokenType.PAREN_CLOSE, "EXPECTED_CLOSING_PARENTHESIS");

      return groupedExpression;
    }

    if (reader.peek().type === TokenType.IDENTIFIER) {
      return undefinedLiteral();
    }

    if (reader.match(TokenType.INT_NUMBER, TokenType.FLOAT_NUMBER)) {
      const token = reader.previous();
      const valueType = tokenTypeToNativeType(token.type);

      return ast.literal(token.value, valueType);
    }

    throw new Error("NO_MATCH_FOUND_FOR_LITERAL");
  }

  function undefinedLiteral(): ValAccessor | Instantiation {
    const acc = accessor();

    if (reader.peek().type === TokenType.BRACKET_OPEN) {
      return instantiation(acc);
    }

    return valaccessor(acc);
  }

  function instantiation(objectType: Accessor): Instantiation {
    reader.consume(TokenType.BRACKET_OPEN, "EXPECTED_OBJECT_INSTANTIATION");

    let values: Expression[] | KeyValue[] = [];
    if (reader.peek().type !== TokenType.BRACKET_CLOSE) {
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

      return {key: key.value, value};
    });
  }

  function orderedInstantiation(): Expression[] {
    return mapWithCommasUntil<Expression>(TokenType.BRACKET_CLOSE, () => expression());
  }

  function valaccessor(value: Accessor): ValAccessor {
    if (reader.peek().type === TokenType.PAREN_OPEN) {
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

      return ast.accessor(name.value, subAccessor);
    }

    return ast.accessor(name.value);
  }

  function mapWithCommasUntil<T>(untilToken: TokenType, map: () => T): T[] {
    let isFirstValue = true;
    return mapUntil<T>(untilToken, () => {
      if (!isFirstValue) {
        reader.consume(TokenType.COMMA, "EXPECTED_COMMA_BETWEEN_EXPRESSIONS");
      }
      isFirstValue = false;

      return map();
    });
  }

  function mapUntil<T>(untilToken: TokenType, map: () => T): T[] {
    const values = [];
    while(reader.peek().type !== untilToken) {
      values.push(map());
    }

    return values;
  }

  function recover() {
    reader.advance();

    while(!reader.isAtEnd()) {
      switch(reader.peek().type) {
        case TokenType.MODULE:
        case TokenType.OBJECT:
          return;
      }

      reader.advance();
    }
  }

  function reportError(error: any) {
    if (typeof error === 'string') {
      reporter.reportRaw(error);
      return;
    }

    if (error instanceof ParseError) {
      reporter.report(error.diagnosticCode, error.diagnosticTemplateValues);
      return;
    }

    reporter.reportRaw(JSON.stringify(error));
  }

  return program();
}

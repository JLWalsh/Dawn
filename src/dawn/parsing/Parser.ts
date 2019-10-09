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
import {FunctionDeclarationArgument} from "@dawn/lang/ast/declarations/FunctionDeclarationArgument";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";
import {Instantiation, KeyValue} from "@dawn/lang/ast/Instantiation";
import {ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {Export} from "@dawn/lang/ast/Export";
import {Declaration} from "@dawn/lang/ast/Declaration";
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

    return { body };
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
    const values: ObjectValue[] = [];
    reader.consume(TokenType.BRACKET_OPEN, "EXPECTED_OBJECT_BODY");

    let isFirstValue = true;
    while (reader.peek().type !== TokenType.BRACKET_CLOSE) {
      if (!isFirstValue) {
        reader.consume(TokenType.COMMA, "EXPECTED_COMMA_BETWEEN_VALUES");
      }
      isFirstValue = false;

      values.push(objectValue());
    }

    reader.consume(TokenType.BRACKET_CLOSE, "EXPECTED_END_OF_OBJECT_DECLARATION");

    return ast.objectDeclaration(name.value, values);
  }

  function objectValue(): ObjectValue {
    const name = reader.consume(TokenType.IDENTIFIER, "Expected value name");
    reader.consume(TokenType.COLON, "Expected colon after value name");
    const type = reader.consume(TokenType.IDENTIFIER, "Expected type for value");

    return { name: name.value, valueType: type.value };
  }

  function moduleDeclaration(): ModuleDeclaration {
    reader.consume(TokenType.MODULE, "Expected module declaration");
    const name = reader.consume(TokenType.IDENTIFIER, "Expected module name");
    reader.consume(TokenType.BRACKET_OPEN, "Expected body for module");

    const body: (Declaration | Export)[] = [];
    while(reader.peek().type !== TokenType.BRACKET_CLOSE) {
      if (reader.peek().type === TokenType.EXPORT) {
        body.push(exportStatement());
      } else {
        body.push(declaration());
      }
    }

    reader.consume(TokenType.BRACKET_CLOSE, "Expected end of body for module");

    return ast.moduleDeclaration(name.value, body);
  }

  function importStatement(): Import {
    reader.consume(TokenType.IMPORT, "Expected import statement");
    const acc = accessor();

    return ast.import(acc);
  }

  function exportStatement(): Export {
    reader.consume(TokenType.EXPORT, "Expected export statement");
    const exported = declaration();

    return ast.export(exported);
  }

  function functionDeclaration(): FunctionDeclaration {
    const name = reader.consume(TokenType.IDENTIFIER, "Expected function name");
    const args: FunctionDeclarationArgument[] = [];

    reader.consume(TokenType.PAREN_OPEN, "Expected function prototype");
    let isFirstArgument = true;
    while(reader.peek().type !== TokenType.PAREN_CLOSE) {
      if (!isFirstArgument) {
        reader.consume(TokenType.COMMA, "Expected comma after argument");
      }
      isFirstArgument = false;
      args.push(functionArgument());
    }

    reader.consume(TokenType.PAREN_CLOSE, "Expected end of function arguments");

    let returnType = null;
    if (reader.match(TokenType.COLON)) {
      const returnTypeToken = reader.consume(TokenType.IDENTIFIER, "Expected return type");
      returnType = returnTypeToken.value;
    }

    const body = functionBody();

    return ast.functionDeclaration(name.value, args, returnType, body);
  }

  function functionArgument(): FunctionDeclarationArgument {
    const variableName = reader.consume(TokenType.IDENTIFIER, "Expected argument name");
    reader.consume(TokenType.COLON, "Expected colon after argument name");
    const variableType = reader.consume(TokenType.IDENTIFIER, "Expected argument type");

    return ast.functionDeclarationArgument(variableName.value, variableType.value);
  }

  function functionBody(): Statement[]  {
    reader.consume(TokenType.BRACKET_OPEN, "Expected function body");
    const body = [];

    while(reader.peek().type !== TokenType.BRACKET_CLOSE) {
      const stmt = statement();
      body.push(stmt);
    }

    reader.consume(TokenType.BRACKET_CLOSE, "Expected end of function body");

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
    reader.consume(TokenType.RETURN, "Expected return statement");
    const value = expression();

    return ast.return(value);
  }

  function valDeclaration(): ValDeclaration {
    reader.consume(TokenType.VAL, "Expected value declaration");
    const name = reader.consume(TokenType.IDENTIFIER, "Expected value name");
    reader.consume(TokenType.EQUALS, "Expected assignment to value");
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
      reader.consume(TokenType.PAREN_CLOSE, "Expected closing parenthesis");

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

    throw new Error("No match found for literal");
  }

  function undefinedLiteral(): ValAccessor | Instantiation {
    const acc = accessor();

    if (reader.peek().type === TokenType.BRACKET_OPEN) {
      return instantiation(acc);
    }

    return valaccessor(acc);
  }

  function instantiation(objectType: Accessor): Instantiation {
    reader.consume(TokenType.BRACKET_OPEN, "Expected object instantiation");

    let values: Expression[] | KeyValue[] = [];
    if (reader.peek().type !== TokenType.BRACKET_CLOSE) {
      if(reader.peekAt(1).type === TokenType.COLON) {
        values = keyValueInstantiation();
      } else {
        values = orderedInstantiation();
      }
    }

    reader.consume(TokenType.BRACKET_CLOSE, "Expected end of object instantiation");

    return ast.instantiation(objectType, values);
  }

  function keyValueInstantiation(): KeyValue[] {
    const values: KeyValue[] = [];

    let isFirstValue = true;
    while(reader.peek().type !== TokenType.BRACKET_CLOSE) {
      if (!isFirstValue) {
        reader.consume(TokenType.COMMA, "Expected comma for next value in instantiation");
      }
      isFirstValue = false;

      const key = reader.consume(TokenType.IDENTIFIER, "Expected key for key value instantiation");
      reader.consume(TokenType.COLON, "Expected assignment for key value instantiation");
      const value = expression();

      values.push({ key: key.value, value });
    }

    return values;
  }

  function orderedInstantiation(): Expression[] {
    const values: Expression[] = [];

    let isFirstValue = true;
    while (reader.peek().type !== TokenType.BRACKET_CLOSE) {
      if(!isFirstValue) {
        reader.consume(TokenType.COMMA, "Expected comma for next value in instantiation");
      }
      isFirstValue = false;

      const value = expression();

      values.push(value);
    }

    return values;
  }

  function valaccessor(value: Accessor): ValAccessor {
    if (reader.peek().type === TokenType.PAREN_OPEN) {
      const invoc = invocation();

      return ast.valAccessor(value, invoc);
    }

    return ast.valAccessor(value);
  }

  function invocation(): Invocation {
    reader.consume(TokenType.PAREN_OPEN, "Expected invocation");
    const args: Expression[] = [];

    let isFirstArgument = true;
    while(reader.peek().type != TokenType.PAREN_CLOSE) {
      if (!isFirstArgument) {
        reader.consume(TokenType.COMMA, "Expected comma after argument");
      }
      isFirstArgument = false;

      const expr = expression();
      args.push(expr);
    }

    reader.consume(TokenType.PAREN_CLOSE, "Expected closing parenthesis");

    return ast.invocation(args);
  }

  function accessor(): Accessor {
    const name = reader.consume(TokenType.IDENTIFIER, "Expected identifier for accessor");

    if (reader.match(TokenType.DOT)) {
      const subAccessor = accessor();

      return ast.accessor(name.value, subAccessor);
    }

    return ast.accessor(name.value);
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

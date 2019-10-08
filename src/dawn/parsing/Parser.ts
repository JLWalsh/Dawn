import {TokenReader} from "@dawn/parsing/TokenReader";
import {TokenType} from "@dawn/parsing/Token";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {Expression} from "@dawn/lang/ast/Expression";
import {Literal} from "@dawn/lang/ast/Literal";
import {ValAccessor} from "@dawn/lang/ast/ValAccessor";
import {Invocation} from "@dawn/lang/ast/Invocation";
import {BinaryExpression, findBinaryExpressionOperator} from "@dawn/lang/ast/expressions/BinaryExpression";
import {ComparisonExpression, findComparisonOperator} from "@dawn/lang/ast/expressions/ComparisonExpression";
import {EqualityExpression, findEqualityOperator} from "@dawn/lang/ast/expressions/EqualityExpression";
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

export function parse(reader: TokenReader): { program: Program, errors: string[] } {

  const errors: string[] = [];

  function program(): Program {
    const body: ProgramContent[] = [];
    while (!reader.isAtEnd()) {
      try {
        if (reader.peek().type === TokenType.MODULE) {
          body.push(moduleDeclaration());
        } else if (reader.peek().type === TokenType.OBJECT) {
          body.push(objectDeclaration());
        } else if (reader.peek().type === TokenType.IMPORT) {
          body.push(importStatement());
        } else if (reader.peek().type === TokenType.IDENTIFIER) {
          body.push(functionDeclaration());
        } else {
          throw new Error("Statement not allowed here");
        }
      } catch (error) {
        if (error instanceof Error) {
          errors.push(error.message);
        } else {
          errors.push(error);
        }
        recover();
      }
    }

    return { body };
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

    throw new Error("Expected declaration");
  }

  function objectDeclaration(): ObjectDeclaration {
    const reference = reader.consume(TokenType.OBJECT, "Expected object declaration");
    const name = reader.consume(TokenType.IDENTIFIER, "Expected object name");
    const values: ObjectValue[] = [];
    reader.consume(TokenType.BRACKET_OPEN, "Expected object body");

    let isFirstValue = true;
    while (reader.peek().type !== TokenType.BRACKET_CLOSE) {
      if (!isFirstValue) {
        reader.consume(TokenType.COMMA, "Expected comma between object values");
      }
      isFirstValue = false;

      values.push(objectValue());
    }

    reader.consume(TokenType.BRACKET_CLOSE, "Expected end of object body");

    return { type: AstNodeType.OBJECT_DECLARATION, reference, name: name.value, values };
  }

  function objectValue(): ObjectValue {
    const name = reader.consume(TokenType.IDENTIFIER, "Expected value name");
    reader.consume(TokenType.COLON, "Expected colon after value name");
    const type = reader.consume(TokenType.IDENTIFIER, "Expected type for value");

    return { name: name.value, valueType: type.value };
  }

  function moduleDeclaration(): ModuleDeclaration {
    const reference = reader.consume(TokenType.MODULE, "Expected module declaration");
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

    return { type: AstNodeType.MODULE_DECLARATION, reference, name: name.value, body };
  }

  function importStatement(): Import {
    const reference = reader.consume(TokenType.IMPORT, "Expected import statement");
    const acc = accessor();

    return { type: AstNodeType.IMPORT, reference, importedModule: acc };
  }

  function exportStatement(): Export {
    const reference = reader.consume(TokenType.EXPORT, "Expected export statement");
    const exported = declaration();

    return { type: AstNodeType.EXPORT, exported, reference };
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

    return {
      type: AstNodeType.FUNCTION_DECLARATION,
      reference: name,
      args,
      name: name.value,
      returnType,
      body,
    };
  }

  function functionArgument(): FunctionDeclarationArgument {
    const variableName = reader.consume(TokenType.IDENTIFIER, "Expected argument name");
    reader.consume(TokenType.COLON, "Expected colon after argument name");
    const variableType = reader.consume(TokenType.IDENTIFIER, "Expected argument type");

    return {
      type: AstNodeType.FUNCTION_DECLARATION_ARGUMENT,
      reference: variableName,
      valueName: variableName.value,
      valueType: variableType.value,
    };
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
    const reference = reader.consume(TokenType.RETURN, "Expected return statement");
    const value = expression();

    return { type: AstNodeType.RETURN, reference, value };
  }

  function valDeclaration(): ValDeclaration {
    const reference = reader.consume(TokenType.VAL, "Expected value declaration");
    const name = reader.consume(TokenType.IDENTIFIER, "Expected value name");
    reader.consume(TokenType.EQUALS, "Expected assignment to value");
    const initializer = expression();

    return { type: AstNodeType.VAL_DECLARATION, reference, name: name.value, initializer };
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

      left = {
        type: AstNodeType.EQUALITY,
        left, right,
        operator: {
          type: operator,
          reference: equalityToken,
        },
      } as EqualityExpression;
    }

    return left;
  }

  function comparison(): Expression {
    let left = addition();

    while(reader.match(TokenType.LESS_OR_EQUAL, TokenType.LESS_THAN, TokenType.GREATER_OR_EQUAL, TokenType.GREATER_THAN)) {
      const operatorToken = reader.previous();
      const operator = findComparisonOperator(operatorToken);
      const right = addition();

      left = {
        type: AstNodeType.COMPARISON,
        left, right,
        reference: left.reference,
        operator: {
          type: operator,
          reference: operatorToken,
        },
      } as ComparisonExpression;
    }

    return left;
  }

  function addition(): Expression {
    let left = multiplication();

    while(reader.match(TokenType.PLUS, TokenType.HYPHEN)) {
      const operatorToken = reader.previous();
      const operator = findBinaryExpressionOperator(operatorToken);
      const right = multiplication();

      left = {
        type: AstNodeType.BINARY,
        left, right,
        reference: left.reference,
        operator: { type: operator, reference: operatorToken },
      } as BinaryExpression;
    }

    return left;
  }

  function multiplication(): Expression {
    let left = unary();

    while(reader.match(TokenType.FORWARD_SLASH, TokenType.STAR)) {
      const operatorToken = reader.previous();
      const operator = findBinaryExpressionOperator(operatorToken);
      const right = unary();

      left = {
        type: AstNodeType.BINARY,
        left, right,
        reference: left.reference,
        operator: { type: operator, reference: operatorToken }
      } as BinaryExpression;
    }

    return left;
  }

  function unary(): Expression {
    if (reader.match(TokenType.BANG, TokenType.HYPHEN)) {
      const operator = reader.previous();
      const right = unary();

      return { type: AstNodeType.UNARY, right, reference: operator, operator: operator.value };
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
      return { type: AstNodeType.LITERAL, value: token.value, reference: token } as Literal;
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
    const reference = reader.consume(TokenType.BRACKET_OPEN, "Expected object instantiation");

    let values: Expression[] | KeyValue[] = [];
    if (reader.peek().type !== TokenType.BRACKET_CLOSE) {
      if(reader.peekAt(1).type === TokenType.COLON) {
        values = keyValueInstantiation();
      } else {
        values = orderedInstantiation();
      }
    }

    reader.consume(TokenType.BRACKET_CLOSE, "Expected end of object instantiation");

    return { type: AstNodeType.INSTANTIATION, reference, objectType, values };
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

      return {
        type: AstNodeType.VALACCESSOR,
        invocation: invoc,
        reference: value.reference,
        value,
      };
    }

    return { type: AstNodeType.VALACCESSOR, reference: value.reference, value };
  }

  function invocation(): Invocation {
    const leftParen = reader.consume(TokenType.PAREN_OPEN, "Expected invocation");
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

    return { type: AstNodeType.INVOCATION, reference: leftParen, arguments: args };
  }

  function accessor(): Accessor {
    const name = reader.consume(TokenType.IDENTIFIER, "Expected identifier for accessor");

    if (reader.match(TokenType.DOT)) {
      const subAccessor = accessor();

      return { type: AstNodeType.ACCESSOR, reference: name, name: name.value, subAccessor };
    }

    return { type: AstNodeType.ACCESSOR, reference: name, name: name.value };
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

  return { program: program(), errors };
}
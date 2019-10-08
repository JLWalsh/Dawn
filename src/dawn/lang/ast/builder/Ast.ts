import {Program, ProgramContent} from "@dawn/lang/ast/Program";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {Export} from "@dawn/lang/ast/Export";
import {Declaration} from "@dawn/lang/ast/Declaration";
import {Import} from "@dawn/lang/ast/Import";
import {Instantiation, KeyValue} from "@dawn/lang/ast/Instantiation";
import {Expression} from "@dawn/lang/ast/Expression";
import {Invocation} from "@dawn/lang/ast/Invocation";
import {Return} from "@dawn/lang/ast/Return";
import {ValAccessor} from "@dawn/lang/ast/ValAccessor";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";
import {FunctionDeclarationArgument} from "@dawn/lang/ast/declarations/FunctionDeclarationArgument";
import {Statement} from "@dawn/lang/ast/Statement";
import {ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {ObjectDeclaration, ObjectValue} from "@dawn/lang/ast/declarations/ObjectDeclaration";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";
import {NativeType} from "@dawn/lang/NativeType";
import {Literal} from "@dawn/lang/ast/Literal";
import {BinaryExpression, BinaryOperator} from "@dawn/lang/ast/expressions/BinaryExpression";
import {EqualityExpression, EqualityOperator} from "@dawn/lang/ast/expressions/EqualityExpression";
import {ComparisonExpression, ComparisonOperator} from "@dawn/lang/ast/expressions/ComparisonExpression";
import {UnaryExpression, UnaryOperator} from "@dawn/lang/ast/expressions/UnaryExpression";

class AstNodeBuilder {

  program(body: ProgramContent[]): Program {
    return { body };
  }

  accessor(name: string, subAccessor?: Accessor): Accessor {
    return { type: AstNodeType.ACCESSOR, name, subAccessor };
  }

  export(exported: Declaration): Export {
    return { type: AstNodeType.EXPORT, exported };
  }

  import(importedModule: Accessor): Import {
    return { type: AstNodeType.IMPORT, importedModule };
  }

  instantiation(objectType: Accessor, values: KeyValue[] | Expression[]): Instantiation {
    return { type: AstNodeType.INSTANTIATION, objectType, values };
  }

  invocation(args: Expression[]): Invocation {
    return { type: AstNodeType.INVOCATION, arguments: args };
  }

  return(value: Expression): Return {
    return { type: AstNodeType.RETURN, value };
  }

  valAccessor(value: Accessor, invocation?: Invocation): ValAccessor {
    return { type: AstNodeType.VALACCESSOR, value, invocation };
  }

  functionDeclaration(name: string, args: FunctionDeclarationArgument[], returnType: string | void, body: Statement[]): FunctionDeclaration {
    return { type: AstNodeType.FUNCTION_DECLARATION, name, args, returnType, body };
  }

  functionDeclarationArgument(valueName: string, valueType: string): FunctionDeclarationArgument {
    return { type: AstNodeType.FUNCTION_DECLARATION_ARGUMENT, valueName, valueType };
  }

  moduleDeclaration(name: string, body: (Export | Declaration)[]): ModuleDeclaration {
    return { type: AstNodeType.MODULE_DECLARATION, name, body };
  }

  objectDeclaration(name: string, values: ObjectValue[]): ObjectDeclaration {
    return { type: AstNodeType.OBJECT_DECLARATION, name, values };
  }

  valDeclaration(name: string, initializer: Expression): ValDeclaration {
    return { type: AstNodeType.VAL_DECLARATION, name, initializer };
  }

  literal(value: any, valueType: NativeType): Literal {
    return { type: AstNodeType.LITERAL, value, valueType };
  }

  equality(left: Expression, operator: EqualityOperator, right: Expression): EqualityExpression {
    return { type: AstNodeType.EQUALITY, left, operator, right };
  }

  comparison(left: Expression, operator: ComparisonOperator, right: Expression): ComparisonExpression {
    return { type: AstNodeType.COMPARISON, left, operator, right };
  }

  binary(left: Expression, operator: BinaryOperator, right: Expression): BinaryExpression {
    return { type: AstNodeType.BINARY, left, operator, right };
  }

  unary(operator: UnaryOperator, right: Expression): UnaryExpression {
    return { type: AstNodeType.UNARY, operator, right };
  }
}

const ast = new AstNodeBuilder();

export default ast;

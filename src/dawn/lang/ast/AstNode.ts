import {Import} from "@dawn/lang/ast/Import";
import {Export} from "@dawn/lang/ast/Export";
import {Return} from "@dawn/lang/ast/Return";
import {ObjectDeclaration} from "@dawn/lang/ast/declarations/ObjectDeclaration";
import {ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";
import {EqualityExpression} from "@dawn/lang/ast/expressions/EqualityExpression";
import {ComparisonExpression} from "@dawn/lang/ast/expressions/ComparisonExpression";
import {BinaryExpression} from "@dawn/lang/ast/expressions/BinaryExpression";
import {UnaryExpression} from "@dawn/lang/ast/expressions/UnaryExpression";
import {Literal} from "@dawn/lang/ast/Literal";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {ValAccessor} from "@dawn/lang/ast/ValAccessor";
import {Invocation} from "@dawn/lang/ast/Invocation";
import {Instantiation} from "@dawn/lang/ast/Instantiation";

export enum AstNodeType {
  IMPORT,
  EXPORT,
  RETURN,

  OBJECT_DECLARATION,
  MODULE_DECLARATION,
  FUNCTION_DECLARATION,
  VAL_DECLARATION,

  EQUALITY,
  COMPARISON,
  BINARY,
  UNARY,
  LITERAL,

  ACCESSOR,
  VALACCESSOR,

  INVOCATION,
  INSTANTIATION,
}

export interface AstNode {
  type: AstNodeType;
  accept<T>(visitor: AstNodeVisitor<T>): T;
}

export interface AstNodeVisitor<T> {
  visitImport(i: Import): T;
  visitExport(e: Export): T;
  visitReturn(r: Return): T;

  visitObjectDeclaration(o: ObjectDeclaration): T;
  visitModuleDeclaration(m: ModuleDeclaration): T;
  visitFunctionDeclaration(f: FunctionDeclaration): T;
  visitValDeclaration(v: ValDeclaration): T;

  visitEquality(e: EqualityExpression): T;
  visitComparison(c: ComparisonExpression): T;
  visitBinary(b: BinaryExpression): T;
  visitUnary(u: UnaryExpression): T;
  visitLiteral(l: Literal): T;

  visitAccessor(a: Accessor): T;
  visitValAccessor(v: ValAccessor): T;

  visitInvocation(i: Invocation): T;
  visitInstantiation(i: Instantiation): T;
}

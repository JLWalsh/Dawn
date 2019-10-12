import {Program} from "@dawn/lang/ast/Program";
import {AstNodeVisitor} from "@dawn/lang/ast/AstNode";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {BinaryExpression} from "@dawn/lang/ast/expressions/BinaryExpression";
import {ComparisonExpression} from "@dawn/lang/ast/expressions/ComparisonExpression";
import {EqualityExpression} from "@dawn/lang/ast/expressions/EqualityExpression";
import {Export} from "@dawn/lang/ast/Export";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";
import {ValAccessor} from "@dawn/lang/ast/ValAccessor";
import {UnaryExpression} from "@dawn/lang/ast/expressions/UnaryExpression";
import {Return} from "@dawn/lang/ast/Return";
import {ObjectDeclaration} from "@dawn/lang/ast/declarations/ObjectDeclaration";
import {ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {Invocation} from "@dawn/lang/ast/Invocation";
import {Instantiation} from "@dawn/lang/ast/Instantiation";
import {Import} from "@dawn/lang/ast/Import";
import {Literal} from "@dawn/lang/ast/Literal";
import {Scope} from "@dawn/interpreter/Scope";
import {RuntimeModule} from "@dawn/interpreter/RuntimeModule";

export class DawnInterpreter {

  interpret(program: Program) {
    const visitor = new InterpreterAstNodeVisitor();

    program.body.forEach(e => e.accept(visitor));
  }
}

class InterpreterAstNodeVisitor implements AstNodeVisitor<void> {

  private readonly callStack = [];
  private readonly globals: Scope = new Scope();
  private readonly modules: RuntimeModule[] = [];

  private currentScope: Scope = this.globals;
  private currentModule: RuntimeModule | void = undefined;

  visitAccessor(a: Accessor): void {
    return undefined;
  }

  visitBinary(b: BinaryExpression): void {
    return undefined;
  }

  visitComparison(c: ComparisonExpression): void {
    return undefined;
  }

  visitEquality(e: EqualityExpression): void {
    return undefined;
  }

  visitExport(e: Export): void {
    return undefined;
  }

  visitFunctionDeclaration(f: FunctionDeclaration): void {
    return undefined;
  }

  visitImport(i: Import): void {
    return undefined;
  }

  visitInstantiation(i: Instantiation): void {
    return undefined;
  }

  visitInvocation(i: Invocation): void {
    return undefined;
  }

  visitLiteral(l: Literal): void {
    return undefined;
  }

  visitModuleDeclaration(m: ModuleDeclaration): void {
    this.currentScope = new Scope(this.currentScope);
    this.currentModule = { parent: this.currentModule, name: m.name };

    m.body.forEach(d => d.accept(this));
  }

  visitObjectDeclaration(o: ObjectDeclaration): void {
    return undefined;
  }

  visitReturn(r: Return): void {
    return undefined;
  }

  visitUnary(u: UnaryExpression): void {
    return undefined;
  }

  visitValAccessor(v: ValAccessor): void {

    return undefined;
  }

  visitValDeclaration(v: ValDeclaration): void {
    return undefined;
  }

}


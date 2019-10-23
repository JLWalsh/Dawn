import {Expression, ExpressionVisitor} from "@dawn/lang/ast/Expression";
import {BinaryExpression, BinaryOperator} from "@dawn/lang/ast/expressions/BinaryExpression";
import {ComparisonExpression, ComparisonOperator} from "@dawn/lang/ast/expressions/ComparisonExpression";
import {EqualityExpression, EqualityOperator} from "@dawn/lang/ast/expressions/EqualityExpression";
import {Instantiation} from "@dawn/lang/ast/Instantiation";
import {Literal} from "@dawn/lang/ast/Literal";
import {UnaryExpression, UnaryOperator} from "@dawn/lang/ast/expressions/UnaryExpression";
import {ValAccessor} from "@dawn/lang/ast/ValAccessor";
import {NativeType} from "@dawn/lang/NativeType";
import {Program} from "@dawn/lang/ast/Program";
import {Compilation} from "@dawn/analysis/Compilation";
import {DeclarationVisitor} from "@dawn/lang/ast/DeclarationNode";
import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";
import {Export} from "@dawn/lang/ast/Export";
import {Import} from "@dawn/lang/ast/Import";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";
import {ObjectDeclaration} from "@dawn/lang/ast/declarations/ObjectDeclaration";
import {StatementVisitor} from "@dawn/lang/ast/Statement";
import {Return} from "@dawn/lang/ast/Return";
import {RuntimeValue} from "@dawn/interpreter/RuntimeValue";

export class DawnInterpreter implements StatementVisitor<void>, ExpressionVisitor<RuntimeValue>, DeclarationVisitor<void> {
  private compilation!: Compilation;

  run(program: Program) {
    this.compilation = Compilation.compile(program);
    const main = program.body.find(node => {
      if (node.type === AstNodeType.FUNCTION_DECLARATION && node.name === 'main') {
        return node;
      }
    }) as FunctionDeclaration | void;

    if (!main) {
      throw new Error(`Missing main method`);
    }

    this.invokeFunction(main);
  }

  evaluate(expression: Expression): RuntimeValue {
    return expression.acceptExpressionVisitor(this);
  }

  visitBinary(b: BinaryExpression): RuntimeValue {
    const left = b.acceptExpressionVisitor(this);
    const right = b.acceptExpressionVisitor(this);
    if (left.type !== right.type) {
      throw new Error(`Type ${left.type} is not compatible with ${right.type}`);
    }

    let newValue: any;
    switch(b.operator) {
      case BinaryOperator.ADD: newValue = left.value + right.value; break;
      case BinaryOperator.SUBTRACT: newValue = left.value - right.value; break;
      case BinaryOperator.MULTIPLY: newValue = left.value * right.value; break;
      case BinaryOperator.DIVIDE: newValue = left.value / right.value; break;
    }

    return { type: left.type, value: newValue };
  }

  visitComparison(c: ComparisonExpression): RuntimeValue {
    const left = c.acceptExpressionVisitor(this);
    const right = c.acceptExpressionVisitor(this);
    if (left.type !== right.type) {
      throw new Error(`Type ${left.type} cannot be compared to ${right.type}`);
    }

    let comparison: any;
    switch(c.operator) {
      case ComparisonOperator.GREATER_EQUAL_THAN: comparison = left.value >= right.value; break;
      case ComparisonOperator.GREATER_THAN: comparison = left.value > right.value; break;
      case ComparisonOperator.LESSER_EQUAL_THAN: comparison = left.value <= right.value; break;
      case ComparisonOperator.LESSER_THAN: comparison = left.value < right.value; break;
    }

    return { type: NativeType.BOOLEAN, value: comparison };
  }

  visitEquality(e: EqualityExpression): RuntimeValue {
    const left = e.acceptExpressionVisitor(this);
    const right = e.acceptExpressionVisitor(this);
    if (left.type !== right.type) {
      throw new Error(`Type ${left.type} cannot be compared to ${right.type}`);
    }

    let comparison: any;
    switch(e.operator) {
      case EqualityOperator.EQUALS: comparison = left.value === right.value; break;
      case EqualityOperator.NOT_EQUAL: comparison = left.value !== right.value; break;
    }

    return RuntimeValue.native(comparison, NativeType.BOOLEAN);
  }

  visitInstantiation(i: Instantiation): RuntimeValue {

  }

  visitLiteral(l: Literal): RuntimeValue {
    return RuntimeValue.native(l.value, l.valueType);
  }

  visitUnary(u: UnaryExpression): RuntimeValue {
    const value = u.right.acceptExpressionVisitor(this);
    let newValue: any;
    switch(u.operator) {
      case UnaryOperator.MINUS: newValue = -value; break;
      case UnaryOperator.NOT: newValue = !value; break;
    }

    return value.withValue(newValue);
  }

  visitValAccessor(v: ValAccessor): RuntimeValue {
    
  }

  visitFunctionDeclaration(f: FunctionDeclaration): void {}

  visitModuleDeclaration(m: ModuleDeclaration): void {
    throw new Error("Method not implemented.");
  }

  visitObjectDeclaration(o: ObjectDeclaration): void {
    throw new Error("Method not implemented.");
  }

  visitValDeclaration(v: ValDeclaration): void {
    throw new Error("Method not implemented.");
  }

  visitImport(i: Import): void {
    throw new Error("Method not implemented.");
  }

  visitExport(e: Export): void {
    throw new Error("Method not implemented.");
  }

  visitExpressionStatement(e: Expression): void {
    throw new Error("Method not implemented.");
  }
  visitReturn(r: Return): void {
    throw new Error("Method not implemented.");
  }

  invokeFunction(functionDeclaration: FunctionDeclaration) {
    functionDeclaration.body.forEach(statement => statement.acceptStatementVisitor(this));
  }
}

import {RuntimeValue} from "@dawn/interpreter/RuntimeValue";
import {Expression, ExpressionVisitor} from "@dawn/lang/ast/Expression";
import {BinaryExpression, BinaryOperator} from "@dawn/lang/ast/expressions/BinaryExpression";
import {ComparisonExpression, ComparisonOperator} from "@dawn/lang/ast/expressions/ComparisonExpression";
import {EqualityExpression, EqualityOperator} from "@dawn/lang/ast/expressions/EqualityExpression";
import {Instantiation} from "@dawn/lang/ast/Instantiation";
import {Literal} from "@dawn/lang/ast/Literal";
import {UnaryExpression} from "@dawn/lang/ast/expressions/UnaryExpression";
import {ValAccessor} from "@dawn/lang/ast/ValAccessor";
import {NativeType} from "@dawn/lang/NativeType";
import {Environment} from "@dawn/interpreter/Environment";
import {SymbolTable} from "@dawn/interpreter/SymbolTable";

export class DawnInterpreter implements ExpressionVisitor<RuntimeValue> {

  private readonly globalEnvironment = new Environment();
  private readonly symbolTable = new SymbolTable();

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

    return { type: NativeType.BOOLEAN, value: comparison };
  }

  visitInstantiation(i: Instantiation): RuntimeValue {

  }

  visitLiteral(l: Literal): RuntimeValue {
    return undefined;
  }

  visitUnary(u: UnaryExpression): RuntimeValue {
    return undefined;
  }

  visitValAccessor(v: ValAccessor): RuntimeValue {
    return undefined;
  }
}

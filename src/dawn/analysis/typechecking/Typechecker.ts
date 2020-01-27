import {Type} from "@dawn/analysis/typechecking/types/Type";
import {Expression, ExpressionVisitor} from "@dawn/lang/ast/Expression";
import {BinaryExpression} from "@dawn/lang/ast/expressions/BinaryExpression";
import {ComparisonExpression} from "@dawn/lang/ast/expressions/ComparisonExpression";
import {EqualityExpression} from "@dawn/lang/ast/expressions/EqualityExpression";
import {Instantiation} from "@dawn/lang/ast/Instantiation";
import {Literal} from "@dawn/lang/ast/Literal";
import {UnaryExpression} from "@dawn/lang/ast/expressions/UnaryExpression";
import {ValAccessor} from "@dawn/lang/ast/ValAccessor";
import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
import {NativeType} from "@dawn/analysis/typechecking/types/NativeType";
import {Keyword} from "@dawn/lang/Keyword";
import {PrimitiveType} from "@dawn/lang/PrimitiveType";
import {AnyType} from "@dawn/analysis/typechecking/types/AnyType";
import {TypeQuery} from "@dawn/analysis/typechecking/types/TypeQuery";

export namespace Typechecker {


  export function typecheckExpression(expression: Expression, diagnostics: DiagnosticReporter): Type {
    const expressionTypechecker = new ExpressionTypecheckerVisitor(diagnostics);

    return expression.acceptExpressionVisitor(expressionTypechecker);
  }

  class ExpressionTypecheckerVisitor implements ExpressionVisitor<Type> {

    constructor(
      private readonly diagnostics: DiagnosticReporter,
    ) {}

    visitBinary(b: BinaryExpression): Type {
      const leftType = b.left.acceptExpressionVisitor(this);
      const rightType = b.right.acceptExpressionVisitor(this);

      if (!this.assertTypesAreSame(leftType, rightType)) {
        return new AnyType();
      }

      return leftType;
    }

    visitComparison(c: ComparisonExpression): Type {
      const leftType = c.left.acceptExpressionVisitor(this);
      const rightType = c.right.acceptExpressionVisitor(this);

      if (!this.assertTypesAreSame(leftType, rightType)) {
        return new AnyType();
      }

      return new NativeType(Keyword.BOOLEAN);
    }

    visitEquality(e: EqualityExpression): Type {
      const leftType = e.left.acceptExpressionVisitor(this);
      const rightType = e.right.acceptExpressionVisitor(this);

      if (!this.assertTypesAreSame(leftType, rightType)) {
        return new AnyType();
      }

      return new NativeType(Keyword.BOOLEAN);
    }

    visitInstantiation(i: Instantiation): Type {
      return undefined;
    }

    visitLiteral(l: Literal): Type {
      switch(l.valueType) {
        case PrimitiveType.FLOAT:
          return new NativeType(Keyword.FLOAT);
        case PrimitiveType.INT:
          return new NativeType(Keyword.INT);
      }

      this.diagnostics.report(`Compiler bug: no type is mapped to primitive type ${l.valueType}`);

      return new AnyType();
    }

    visitUnary(u: UnaryExpression): Type {
      return undefined;
    }

    visitValAccessor(v: ValAccessor): Type {
      return undefined;
    }

    private assertTypesAreSame(left: Type, right: Type): boolean {
      if (!TypeQuery.areSame(left, right)) {
        this.diagnostics.report("INCOMPATIBLE_TYPES", {
          templating: {
            left: left.describe(),
            right: right.describe()
          }
        });

        return false;
      }

      return true;
    }
  }
}
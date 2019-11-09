import {Compilation} from "@dawn/analysis/Compilation";
import {DeclarationVisitor, isNamedDeclaration} from "@dawn/lang/ast/DeclarationNode";
import {StatementVisitor} from "@dawn/lang/ast/Statement";
import {Expression, ExpressionVisitor} from "@dawn/lang/ast/Expression";
import {BinaryExpression, BinaryOperator} from "@dawn/lang/ast/expressions/BinaryExpression";
import {ComparisonExpression, ComparisonOperator} from "@dawn/lang/ast/expressions/ComparisonExpression";
import {EqualityExpression, EqualityOperator} from "@dawn/lang/ast/expressions/EqualityExpression";
import {Export} from "@dawn/lang/ast/Export";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";
import {ValAccessor} from "@dawn/lang/ast/ValAccessor";
import {UnaryExpression, UnaryOperator} from "@dawn/lang/ast/expressions/UnaryExpression";
import {Return} from "@dawn/lang/ast/Return";
import {ObjectDeclaration} from "@dawn/lang/ast/declarations/ObjectDeclaration";
import {Import} from "@dawn/lang/ast/Import";
import {Instantiation, isKeyValueInstantiation, isOrderedInstantiation} from "@dawn/lang/ast/Instantiation";
import {Literal} from "@dawn/lang/ast/Literal";
import {ModuleContent, ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {ObjectDeclarationSymbol} from "@dawn/analysis/symbols/ObjectDeclarationSymbol";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {ModuleSymbol} from "@dawn/analysis/symbols/ModuleSymbol";
import ast from "@dawn/lang/ast/builder/Ast";

export class JavascriptEmitter {

  emit(compilation: Compilation): string {
    const visitor = new JavascriptEmitterVisitor(compilation);

    return compilation.program.body.map(e => {
      const value = e.acceptDeclarationVisitor(visitor);

      if (!isNamedDeclaration(e)) {
        return value;
      }

      switch(e.type) {
        case AstNodeType.VAL_DECLARATION:
        case AstNodeType.FUNCTION_DECLARATION:
        case AstNodeType.MODULE_DECLARATION:
          return `const ${e.name} = ${value}`;
      }
    }).join('\n');
  }
}

class JavascriptEmitterVisitor implements DeclarationVisitor<string>, StatementVisitor<string>, ExpressionVisitor<string> {

  private currentModule: ModuleSymbol;
  private indentLevel = 0;

  constructor(
    private readonly compilation: Compilation,
  ) {
    this.currentModule = compilation.globalSymbols;
  }

  visitBinary(b: BinaryExpression): string {
    const lhs = b.left.acceptExpressionVisitor(this);
    const rhs = b.right.acceptExpressionVisitor(this);

    switch(b.operator) {
      case BinaryOperator.DIVIDE:
        return `(${lhs} / ${rhs})`;
      case BinaryOperator.MULTIPLY:
        return `(${lhs} * ${rhs})`;
      case BinaryOperator.ADD:
        return `(${lhs} + ${rhs})`;
      case BinaryOperator.SUBTRACT:
        return `(${lhs} - ${rhs})`;
    }
  }

  visitComparison(c: ComparisonExpression): string {
    const lhs = c.left.acceptExpressionVisitor(this);
    const rhs = c.right.acceptExpressionVisitor(this);

    switch(c.operator) {
      case ComparisonOperator.LESSER_THAN:
        return `(${lhs} < ${rhs})`;
      case ComparisonOperator.LESSER_EQUAL_THAN:
        return `(${lhs} <= ${rhs})`;
      case ComparisonOperator.GREATER_THAN:
        return `(${lhs} > ${rhs})`;
      case ComparisonOperator.GREATER_EQUAL_THAN:
        return `(${lhs} >= ${rhs})`;
    }
  }

  visitEquality(e: EqualityExpression): string {
    const lhs = e.left.acceptExpressionVisitor(this);
    const rhs = e.right.acceptExpressionVisitor(this);

    switch(e.operator) {
      case EqualityOperator.EQUALS:
        return `(${lhs} === ${rhs})`;
      case EqualityOperator.NOT_EQUAL:
        return `(${lhs} !== ${rhs})`;
    }
  }

  visitExport(e: Export): string {
    return '/* This should never be called (export) */';
  }

  visitExpressionStatement(e: Expression): string {
    return e.acceptExpressionVisitor(this);
  }

  visitFunctionDeclaration(f: FunctionDeclaration): string {
    const args = f.args.map(a => a.valueName).join(', ');
    this.indentLevel++;
    const body = f.body.map(b => {
      const value = b.acceptStatementVisitor(this);

      switch(b.type) {
        case AstNodeType.VAL_DECLARATION:
          return `const ${b.name} = ${value}`;
        default:
          return value;
      }
    }).map(this.indent).join('\n');
    this.indentLevel--;

    const declaredFunction = `function (${args}) {
      ${body}
    }`;

    if (f.name === 'main') {
      return `(${declaredFunction})()`;
    }

    return declaredFunction;
  }

  visitImport(i: Import): string {
    const moduleName = this.expandAccessor(i.importedModule);
    if (moduleName === 'math') {
      return `const math = {
        pow: Math.pow,
        sqrt: Math.sqrt
      }`;
    }

    if (moduleName === 'io') {
      return `const io = {
        print(value) {
          console.log("Dawn: " + value);
        }
      }`;
    }

    throw new Error(`Unrecognized module: ${moduleName}`);
  }

  visitInstantiation(i: Instantiation): string {
    const instantiatedObject = this.compilation.symbolResolver.resolve(i.objectType, this.currentModule)
    if (!instantiatedObject) {
      throw new Error(`Unresolved symbol: ${this.expandAccessor(i.objectType)}`);
    }

    if (!(instantiatedObject instanceof ObjectDeclarationSymbol)) {
      throw new Error(`Expected type to be object declaration`);
    }

    if (i.values.length === 0) {
      return `{}`;
    }

    const object: {[k: string]: any} = {};
    if (isKeyValueInstantiation(i)) {
      instantiatedObject.node.values.forEach(value => {
        const instantiatedValue = i.values.find(s => s.key === value.name);
        if (!instantiatedValue) {
          throw new Error(`Value ${value.name} is missing from instantiation of ${instantiatedObject.name}`);
        }

        object[value.name] = instantiatedValue.value.acceptExpressionVisitor(this);
      });
    } else if (isOrderedInstantiation(i)) {
      if (instantiatedObject.node.values.length !== i.values.length) {
        throw new Error(`Too many or too few values for instantiation of ${instantiatedObject.name}`);
      }

      instantiatedObject.node.values.forEach((value, index) => {
        const instantiatedValue = i.values[index];
        if (!instantiatedValue) {
          throw new Error(`Value ${value.name} is missing from instantiation of ${instantiatedObject.name}`);
        }

        object[value.name] = instantiatedValue.acceptExpressionVisitor(this);
      });
    }

    return JSON.stringify(object);
  }

  visitLiteral(l: Literal): string {
    return l.value;
  }

  visitModuleDeclaration(m: ModuleDeclaration): string {
    const moduleSymbol = this.compilation.symbolResolver.resolve(ast.accessor(m.name), this.currentModule);
    if (!(moduleSymbol instanceof ModuleSymbol)) {
      throw new Error(`This is literally impossible!`);
    }
    this.indentLevel++;
    this.currentModule = moduleSymbol;

    const emitDeclaration = (d: ModuleContent): string => {
      switch(d.type) {
        case AstNodeType.FUNCTION_DECLARATION:
          return d.name + ': ' + d.acceptDeclarationVisitor(this);
        case AstNodeType.VAL_DECLARATION:
          return d.name + ': ' + d.acceptDeclarationVisitor(this);
        case AstNodeType.EXPORT:
          return emitDeclaration(d.exported);
        case AstNodeType.MODULE_DECLARATION:
          return d.name + ': ' + d.acceptDeclarationVisitor(this);
        default:
          return '';
      }
    };

    const moduleValues = m.body.map(emitDeclaration).filter(d => d).map(this.indent).join(", \n");
    this.currentModule = this.currentModule.getParent() as ModuleSymbol;
    this.indentLevel--;

    return `{
        ${moduleValues}
      }`.split('\n').map(this.indent).join('\n');
  }

  visitObjectDeclaration(o: ObjectDeclaration): string {
    return '/* This should not be called (object declaration )*/';
  }

  visitReturn(r: Return): string {
    return `return ${r.value.acceptExpressionVisitor(this)}`;
  }

  visitUnary(u: UnaryExpression): string {
    const rhs = u.right.acceptExpressionVisitor(this);

    switch (u.operator) {
      case UnaryOperator.MINUS:
        return `(-${rhs})`;
      case UnaryOperator.NOT:
        return `(!${rhs})`;
    }
  }

  visitValAccessor(v: ValAccessor): string {
    const chain = this.expandAccessor(v.value);

    if (v.invocation) {
      const args = v.invocation.arguments.map(a => a.acceptExpressionVisitor(this)).join(', ');

      return `${chain}(${args})`;
    }

    return chain;
  }

  visitValDeclaration(v: ValDeclaration): string {
    return v.initializer.acceptExpressionVisitor(this);
  }

  private indent = (value: string) => {
    return '  '.repeat(this.indentLevel) + value;
  }

  private expandAccessor(accessor: Accessor): string {
    let value = accessor.name;
    let nextAccessor = accessor.subAccessor;
    while (nextAccessor) {
      value += `.${nextAccessor.name}`;
      nextAccessor = nextAccessor.subAccessor;
    }

    return value;
  }
}

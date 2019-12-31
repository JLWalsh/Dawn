import ast from "@dawn/lang/ast/builder/Ast";
import {SymbolResolver} from "@dawn/analysis/SymbolResolver";
import {TypeContext} from "@dawn/typechecking/TypeContext";
import {NullDiagnosticReporter} from "@dawn/ui/NullDiagnosticReporter";
import {TypeExpander} from "@dawn/typechecking/TypeExpander";
import {Scope} from "@dawn/analysis/Scope";
import {Types} from "@dawn/typechecking/Types";
import {NativeType} from "@dawn/lang/NativeType";
import {ObjectSymbol, ObjectSymbolValue} from "@dawn/analysis/symbols/ObjectSymbol";
import PrimitiveType = Types.PrimitiveType;
import StructuralType = Types.StructuralType;

describe('TypeExpander', () => {
  const symbolResolver = new SymbolResolver();
  const diagnostics = new NullDiagnosticReporter();
  let typeContext: TypeContext;
  let typeExpander: TypeExpander;
  let scope: Scope;

  beforeEach(() => {
    typeContext = new TypeContext();
    typeExpander = new TypeExpander(typeContext, diagnostics, symbolResolver);
    scope = new Scope();
  });

  describe('given object symbol', () => {
    describe('when expanding types of its properties', () => {
      it('should expand int to a primitive type', () => {
        const objectSymbol = new ObjectSymbol('bob', [
          new ObjectSymbolValue('intVal', ast.accessor('int')),
        ]);

        const expandedType = typeExpander.expandObjectType(objectSymbol, scope);

        const expectedType = givenStructuralType({ intVal: new PrimitiveType(NativeType.INT) });
        expect(expandedType).toEqual(expectedType);
      });

      it('should expand boolean to a primitive type', () => {
        const objectSymbol = new ObjectSymbol('bob', [
          new ObjectSymbolValue('boolVal', ast.accessor('boolean')),
        ]);

        const expandedType = typeExpander.expandObjectType(objectSymbol, scope);

        const expectedType = givenStructuralType({ boolVal: new PrimitiveType(NativeType.BOOLEAN) });
        expect(expandedType).toEqual(expectedType);
      });

      it('should expand the type of its object properties', () => {
        const parentObjectSymbol = new ObjectSymbol('ParentType', [
          new ObjectSymbolValue('childProperty', ast.accessor('ChildType')),
        ]);
        const childObjectSymbol = new ObjectSymbol('ChildType', [
          new ObjectSymbolValue('intVal', ast.accessor('int')),
        ]);
        const scope = new Scope();
        scope.addSymbol(parentObjectSymbol, childObjectSymbol);

        const expandedType = typeExpander.expandObjectType(parentObjectSymbol, scope);

        const expectedChildExpandedType = givenStructuralType({ intVal: new PrimitiveType(NativeType.INT) });
        const expectedType = givenStructuralType({ childProperty: expectedChildExpandedType });
        expect(expandedType).toEqual(expectedType);
      });
    });

    it('should define type for that object', () => {
      const objectSymbol = new ObjectSymbol('symbol', []);
      typeContext.defineType = jest.fn();

      const expandedType = typeExpander.expandObjectType(objectSymbol, scope);

      expect(typeContext.defineType).toHaveBeenCalledWith(objectSymbol, expandedType);
    });

    describe('that recurses itself directly', () => {
      const objectSymbol = new ObjectSymbol('recursiveType', [
        new ObjectSymbolValue('someProperty', ast.accessor('recursiveType')),
      ]);

      beforeEach(() => {
        scope.addSymbol(objectSymbol);
        diagnostics.report = jest.fn();
      });

      it('should report error', () => {
        typeExpander.expandObjectType(objectSymbol, scope);

        expect(diagnostics.report).toHaveBeenCalledWith("RECURSIVE_TYPE_NOT_ALLOWED", expect.anything());
      });
    });

    describe('that recurses itself indirectly', () => {
      const firstObjectSymbol = new ObjectSymbol('FirstObjectSymbol', [
        new ObjectSymbolValue('someProperty', ast.accessor('SecondObjectSymbol')),
      ]);
      const secondObjectSymbol = new ObjectSymbol('SecondObjectSymbol', [
        new ObjectSymbolValue('someProperty', ast.accessor('FirstObjectSymbol')),
      ]);

      beforeEach(() => {
       scope.addSymbol(firstObjectSymbol, secondObjectSymbol);
       diagnostics.report = jest.fn();
      });

      it('should report error', () => {
        typeExpander.expandObjectType(firstObjectSymbol, scope);

        expect(diagnostics.report).toHaveBeenCalledWith("RECURSIVE_TYPE_NOT_ALLOWED", expect.anything());
      });
    });

    describe('and a property is duplicated', () => {
      it('should report error', () => {
        const objectSymbol = new ObjectSymbol('a', [
          new ObjectSymbolValue('duplicated', ast.accessor('int')),
          new ObjectSymbolValue('duplicated', ast.accessor('boolean')),
        ]);
        diagnostics.report = jest.fn();

        typeExpander.expandObjectType(objectSymbol, scope);

        expect(diagnostics.report).toHaveBeenCalledWith("DUPLICATE_PROPERTY_FOR_TYPE", expect.anything());
      });
    });
  });

  function givenStructuralType(properties: { [key: string]: Types.Type }) {
    const propertiesOfType = new Map<string, Types.Type>();
    Object.entries(properties).forEach(([key, type]) => propertiesOfType.set(key, type));

    return new StructuralType(propertiesOfType);
  }
});

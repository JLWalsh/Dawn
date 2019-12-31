import ast from "@dawn/lang/ast/builder/Ast";
import {SymbolResolver} from "@dawn/analysis/SymbolResolver";
import {TypeContext} from "@dawn/typechecking/TypeContext";
import {NullDiagnosticReporter} from "@dawn/ui/NullDiagnosticReporter";
import {TypeExpander} from "@dawn/typechecking/TypeExpander";
import {Scope} from "@dawn/analysis/Scope";
import {Types} from "@dawn/typechecking/Types";
import {NativeType} from "@dawn/lang/NativeType";
import PrimitiveType = Types.PrimitiveType;
import {ObjectSymbol} from "@dawn/analysis/symbols/ObjectSymbol";

describe('TypeExpander', () => {
  const EMPTY_SCOPE = new Scope();

  const symbolResolver = new SymbolResolver();
  const diagnostics = new NullDiagnosticReporter();
  let typeContext: TypeContext;
  let typeExpander: TypeExpander;

  beforeEach(() => {
    typeContext = new TypeContext();
    typeExpander = new TypeExpander(typeContext, diagnostics, symbolResolver);
  });

  describe('given symbol pointing to a primitive type', () => {
    it('should expand int to a primitive type', () => {
      const intNativeTypeAccessor = ast.accessor('int');
      const expectedType = new PrimitiveType(NativeType.INT);

      const expandedType = typeExpander.expandType(intNativeTypeAccessor, EMPTY_SCOPE);

      expect(expandedType).toEqual(expectedType);
    });

    it('should expand boolean to a primitive type', () => {
      const booleanNativeTypeAccessor = ast.accessor('boolean');
      const expectedType = new PrimitiveType(NativeType.BOOLEAN);

      const expandedType = typeExpander.expandType(booleanNativeTypeAccessor, EMPTY_SCOPE);

      expect(expandedType).toEqual(expectedType);
    });
  });

  describe('given object symbol', () => {
    it('should expand the types of all its keys', () => {
      const objectSymbol = new ObjectSymbol();
    });

    it('should define type for that object', () => {

    });

    describe('that recurses itself directly', () => {
      it('should report error', () => {

      });

      it('should not define type for that object', () => {

      });
    });

    describe('that recurses itself indirectly', () => {
      it('should report error', () => {

      });

      it('should not define type for that object', () => {

      });
    });
  });
});

import {TypeContext} from "@dawn/typechecking/TypeContext";
import {ValSymbol} from "@dawn/analysis/symbols/ValSymbol";
import {Types} from "@dawn/typechecking/Types";
import {NativeType} from "@dawn/lang/NativeType";
import PrimitiveType = Types.PrimitiveType;

describe('TypeContext', () => {
  const A_SYMBOL = new ValSymbol('symbol');
  let context: TypeContext;

  describe('given type for symbol', () => {
    beforeEach(() => {
      context = new TypeContext();
      context.defineType(A_SYMBOL, new PrimitiveType(NativeType.BOOLEAN));
    });

    it('should have type for symbol', () => {
      const hasTypeForSymbol = context.hasTypeFor(A_SYMBOL);

      expect(hasTypeForSymbol).toBeTruthy();
    });

    it('should throw error when defining type for same symbol', () => {
        expect(() => context.defineType(A_SYMBOL, new PrimitiveType(NativeType.INT))).toThrowError();
    });
  });

  describe('given no type for symbol', () => {
    beforeEach(() => {
      context = new TypeContext();
    });

    it('should not have type for symbol', () => {
      const hasTypeForSymbol = context.hasTypeFor(A_SYMBOL);

      expect(hasTypeForSymbol).toBeFalsy();
    });
  });

});

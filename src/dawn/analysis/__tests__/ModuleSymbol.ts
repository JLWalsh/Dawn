import {ModuleSymbol} from "@dawn/analysis/symbols/ModuleSymbol";
import {ISymbol, SymbolVisibility} from "@dawn/analysis/symbols/ISymbol";

describe('ModuleSymbol', () => {

  const INTERNAL_SYMBOL: ISymbol = { visibility: SymbolVisibility.INTERNAL };
  const EXPORTED_SYMBOL: ISymbol = { visibility: SymbolVisibility.EXPORTED };

  describe('when upward lookup symbol that exists in module', () => {
    it('should find symbol', () => {
      const module = new ModuleSymbol(SymbolVisibility.INTERNAL);
      module.define('bob', INTERNAL_SYMBOL);

      expect(module.upwardsLookup('bob')).toEqual(INTERNAL_SYMBOL);
    });
  });

  describe('when upward lookup symbol that exists in parent module', () => {
    it('should find symbol', () => {
      const parentModule = new ModuleSymbol(SymbolVisibility.INTERNAL);
      const module = new ModuleSymbol(SymbolVisibility.INTERNAL, parentModule);
      parentModule.define('anderson', INTERNAL_SYMBOL);

      expect(module.upwardsLookup('anderson')).toEqual(INTERNAL_SYMBOL);
    });
  });

  describe('when downward lookup exported symbol that exists in module', () => {
    it('should find symbol', () => {
      const module = new ModuleSymbol(SymbolVisibility.INTERNAL);
      module.define('bob', EXPORTED_SYMBOL);

      expect(module.downwardsLookup('bob')).toEqual(EXPORTED_SYMBOL);
    });
  });

  describe('when downward lookup internal symbol that exists in module', () => {
    it('should not find symbol', () => {
      const module = new ModuleSymbol(SymbolVisibility.INTERNAL);
      module.define('bob', INTERNAL_SYMBOL);

      expect(module.downwardsLookup('bob')).toBeUndefined();
    });
  });

  describe('when define already existing symbol', () => {
    it('should throw error', () => {
      const module = new ModuleSymbol(SymbolVisibility.INTERNAL);
      module.define('bob', INTERNAL_SYMBOL);

      expect(() => module.define('bob', EXPORTED_SYMBOL)).toThrowError();
    });
  });
});
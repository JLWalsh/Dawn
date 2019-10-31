import {SymbolResolver} from "@dawn/analysis/symbols/SymbolResolver";
import {ISymbol, SymbolVisibility} from "@dawn/analysis/symbols/ISymbol";
import {ModuleSymbol} from "@dawn/analysis/symbols/ModuleSymbol";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {AstNodeType} from "@dawn/lang/ast/AstNode";

describe('SymbolResolver', () => {

  const EXTERNAL_SYMBOL: ISymbol = { visibility: SymbolVisibility.EXPORTED };
  const INTERNAL_SYMBOL: ISymbol = { visibility: SymbolVisibility.INTERNAL };

  const symbolResolver = new SymbolResolver();

  describe('given symbol in current module', () => {
    it('should resolve symbol', () => {
      const module = givenModuleTopology({ bob: true }, EXTERNAL_SYMBOL);
      const accessor = givenAccessor('bob');

      const symbol = symbolResolver.resolve(accessor, module);

      expect(symbol).toEqual(EXTERNAL_SYMBOL);
    });
  });

  describe('given symbol in upper module', () => {
    it('should resolve symbol when addressed directly', () => {
      const module = givenModuleTopology({ parent: { bob: true, child: {} } }, EXTERNAL_SYMBOL);
      const childModule = getModule('parent.child', module);
      const accessor = givenAccessor('bob');

      const symbol = symbolResolver.resolve(accessor, childModule);

      expect(symbol).toEqual(EXTERNAL_SYMBOL);
    });

    it('should resolve symbol when addressed using parent', () => {
      const module = givenModuleTopology({ parent: { bob: true, child: {} } }, EXTERNAL_SYMBOL);
      const childModule = getModule('parent.child', module);
      const accessor = givenAccessor('parent.bob');

      const symbol = symbolResolver.resolve(accessor, childModule);

      expect(symbol).toEqual(EXTERNAL_SYMBOL);
    });
  });

  describe('given external symbol in child module', () => {
    it('should resolve symbol', () => {
      const module = givenModuleTopology({ module: { bob: true } }, EXTERNAL_SYMBOL);
      const accessor = givenAccessor('module.bob');

      const symbol = symbolResolver.resolve(accessor, module);

      expect(symbol).toEqual(EXTERNAL_SYMBOL);
    });
  });

  describe('given internal symbol in child module', () => {
    it('should not resolve symbol', () => {
      const module = givenModuleTopology({ module: { bob: true } }, INTERNAL_SYMBOL);
      const accessor = givenAccessor('module.bob');

      const symbol = symbolResolver.resolve(accessor, module);

      expect(symbol).toBeUndefined();
    });
  });

  describe('given symbol in module at same level', () => {
    const module = givenModuleTopology({ parent: { a: { bob: true }, b: {} } }, EXTERNAL_SYMBOL);
    const moduleB = getModule('parent.b', module);

    it('should resolve symbol when accessed using parent module', () => {
      const accessor = givenAccessor('parent.a.bob');

      const symbol = symbolResolver.resolve(accessor, moduleB);

      expect(symbol).toEqual(EXTERNAL_SYMBOL);
    });

    it('should resolve symbol when accessed directly', () => {
      const accessor = givenAccessor('a.bob');

      const symbol = symbolResolver.resolve(accessor, moduleB);

      expect(symbol).toEqual(EXTERNAL_SYMBOL);
    });

    it('should not resolve symbol when accessed using other module at same level', () => {
      const accessor = givenAccessor('parent.b.a.bob');

      const symbol = symbolResolver.resolve(accessor, moduleB);

      expect(symbol).toBeUndefined();
    });
  });

  interface ModuleTopology {
    [moduleName: string]: ModuleTopology | boolean;
  }

  function givenAccessor(rawValue: string): Accessor  {
    return rawValue.split('.')
      .reverse()
      .reduce((accessor: Accessor, value) => {
        // @ts-ignore
        if (Object.keys(accessor).length === 0) {
          return { type: AstNodeType.ACCESSOR, name: value };
        }

        return { type: AstNodeType.ACCESSOR, name: value, subAccessor: accessor };
      }, {} as Accessor);
  }

  function givenModuleTopology(modules: ModuleTopology, symbolToDefine: ISymbol, parentModule?: ModuleSymbol)  {
    const parent = new ModuleSymbol(SymbolVisibility.EXPORTED, parentModule);
    Object.keys(modules).forEach(symbolName => {
      const symbol = modules[symbolName];
      if (typeof symbol !== 'boolean') {
        const module = givenModuleTopology(symbol, symbolToDefine, parent);

        parent.define(symbolName, module);
      } else {
        parent.define(symbolName, symbolToDefine);
      }
    });

    return parent;
  }

  function getModule(modulePath: string, module: ModuleSymbol) {
    return modulePath
      .split('.')
      .reduce((currentModule, moduleName) => {
        return currentModule.downwardsLookup(moduleName) as ModuleSymbol;
      }, module);
  }
});
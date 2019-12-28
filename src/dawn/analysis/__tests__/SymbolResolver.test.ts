import {SymbolResolver} from "@dawn/analysis/SymbolResolver";
import {Accessor} from "@dawn/lang/ast/Accessor";
import {AstNodeType} from "@dawn/lang/ast/AstNode";
import {ExportedSymbol} from "@dawn/analysis/symbols/ExportedSymbol";
import {ValSymbol} from "@dawn/analysis/symbols/ValSymbol";
import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
import {Scope} from "@dawn/analysis/scopes/Scope";
import {ModuleSymbol} from "@dawn/analysis/symbols/ModuleSymbol";

describe('SymbolResolver', () => {

  const symbolResolver = new SymbolResolver();

  describe('given symbol in current module', () => {
    it('should resolve symbol', () => {
      const scope = new Scope();
      const symbolInModule = givenExportedSymbol('bob');
      scope.addSymbol(symbolInModule);
      const accessor = givenAccessor('bob');

      const symbol = symbolResolver.resolve(accessor, scope);

      expect(symbol).toEqual(symbolInModule);
    });
  });

  describe('given symbol in upper scope', () => {
    const UPPER_SCOPE_NAME = 'upper';
    const CHILD_SCOPE_NAME = 'child';

    let globalScope: Scope;
    let upperScope: Scope;
    let childScope: Scope;

    beforeEach(() => {
      globalScope = new Scope();
      upperScope = new Scope(globalScope);
      globalScope.addSymbol(new ModuleSymbol(UPPER_SCOPE_NAME, upperScope));
      childScope = new Scope(upperScope);
      upperScope.addSymbol(new ModuleSymbol(CHILD_SCOPE_NAME, childScope));
    });

    it('should resolve symbol when addressed from child scope', () => {
      const symbolInChild = givenExportedSymbol('bobby');
      upperScope.addSymbol(symbolInChild);

      const symbol = symbolResolver.resolve(givenAccessor('bobby'), childScope);

      expect(symbol).toEqual(symbolInChild);
    });

    it('should resolve symbol when addressed from upper scope', () => {
      const symbolInChild = givenExportedSymbol('bobby');
      upperScope.addSymbol(symbolInChild);

      const symbol = symbolResolver.resolve(givenAccessor(`${UPPER_SCOPE_NAME}.bobby`), childScope);

      expect(symbol).toEqual(symbolInChild);
    });
  });

  describe('given exported symbol in child scope', () => {
    const upperScope = new Scope();
    const childScope = new Scope(upperScope);

    it('should resolve symbol', () => {
      upperScope.addSymbol(new ModuleSymbol('child', childScope));
      const symbolInChild = givenExportedSymbol('bob');
      childScope.addSymbol(symbolInChild);
      const accessor = givenAccessor('child.bob');

      const symbol = symbolResolver.resolve(accessor, upperScope);

      expect(symbol).toEqual(symbolInChild);
    });
  });

  describe('given internal symbol in child scope', () => {
    const parentScope = new Scope();
    const childScope = new Scope(parentScope);

    beforeAll(() => {
      parentScope.addSymbol(new ModuleSymbol('child', childScope));
    });

    it('should not resolve symbol when addressed from parent scope', () => {
      childScope.addSymbol(givenInternalSymbol('bob'));
      const accessor = givenAccessor('child.bob');

      const symbol = symbolResolver.resolve(accessor, parentScope);

      expect(symbol).toBeUndefined();
    });
  });

  describe('given symbol in other scope at same level', () => {
    const globalScope = new Scope();
    const parentScope = new Scope(globalScope);
    const otherChildScope = new Scope(parentScope);
    const childScope = new Scope(parentScope);
    const exportedSymbol = givenExportedSymbol('anExportedSymbol');

    beforeAll(() => {
      globalScope.addSymbol(new ModuleSymbol('parent', parentScope));
      parentScope.addSymbol(new ModuleSymbol('otherChildScope', otherChildScope));
      parentScope.addSymbol(new ModuleSymbol('childScope', childScope));
      childScope.addSymbol(exportedSymbol);
    });

    it('should resolve symbol when addressed using parent scope', () => {
      const accessor = givenAccessor('parentScope.otherChildScope.anExportedSymbol');

      const symbol = symbolResolver.resolve(accessor, childScope);

      expect(symbol).toEqual(exportedSymbol);
    });

    it('should resolve symbol when accessed directly', () => {
      const accessor = givenAccessor('otherChildScope.bob');

      const symbol = symbolResolver.resolve(accessor, childScope);

      expect(symbol).toEqual(exportedSymbol);
    });

    it('should not resolve symbol when accessed using other module at same level', () => {
      const accessor = givenAccessor('parent.childScope.otherChildScope.anExportedSymbol');

      const symbol = symbolResolver.resolve(accessor, childScope);

      expect(symbol).toBeUndefined();
    });
  });

  function givenExportedSymbol(symbolName: string): ISymbol {
    return new ExportedSymbol(givenInternalSymbol(symbolName));
  }

  function givenInternalSymbol(symbolName: string): ISymbol {
    return new ValSymbol(symbolName);
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
});

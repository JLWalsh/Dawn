import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";

type Type = void;

interface Symbol {
  name: string;
}

interface ModuleSymbol extends Symbol {
  exported: Symbol[];
  internal: Symbol[];
}

interface FunctionSymbol extends Symbol {
  implementations: FunctionImplementation[];
  returns: Type;
}

interface FunctionImplementation {
  args: Type[];
  declaration: FunctionDeclaration;
}

interface ValSymbol extends Symbol {
  type: Type;
}

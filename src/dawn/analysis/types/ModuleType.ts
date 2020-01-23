import {Type} from "@dawn/analysis/types/Type";

export interface ModuleType extends Type {
  members: Map<string, Type>;
  parent: ModuleType | void;
}


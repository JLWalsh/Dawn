import {Scope} from "@dawn/analysis/scopes/Scope";

export class FunctionScope implements Scope {
  getChildren(): Scope[] {
    return [];
  }


}

import {Scope} from "@dawn/analysis/scopes/Scope";

export class GlobalScope implements Scope {
  getChildren(): Scope[] {
    return [];
  }

}

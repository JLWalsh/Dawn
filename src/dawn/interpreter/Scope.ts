import {RuntimeValue} from "@dawn/interpreter/RuntimeValue";

export class Scope {

  constructor(
    private readonly parent?: Scope,
    private readonly values: Map<string, RuntimeValue> = new Map(),
  ) {}

  getValue(name: string): RuntimeValue | void {
    const value = this.values.get(name);
    if(value) {
      return value;
    }

    if (this.parent) {
      return this.parent.getValue(name);
    }
  }

  getParent(): Scope | void {
    return this.parent;
  }
}

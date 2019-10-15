import {RuntimeValue} from "@dawn/interpreter/RuntimeValue";

export class Environment {

  constructor(
    private readonly parent: Environment | void,
    private readonly values: Map<string, RuntimeValue> = new Map(),
  ) {}

  find(name: string): RuntimeValue | void {
    const value = this.values.get(name);
    if (value) {
      return value;
    }

    if (this.parent) {
      return this.parent.find(name);
    }
  }

  define(name: string, value: RuntimeValue) {
    if (this.values.has(name)) {
      throw new Error(`Redefinition of ${name} is not allowed`);
    }

    this.values.set(name, value);
  }

  assign(name: string, newValue: RuntimeValue) {
    const value = this.values.get(name);
    if (!value) {
      throw new Error(`Cannot assign to ${name} as it does not exist`);
    }

    if (value.type !== newValue.type) {
      throw new Error(`Cannot assign to ${name} as type ${newValue.type} is not assignable to ${value.type}`);
    }

    this.values.set(name, newValue);
  }
}

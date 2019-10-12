import {RuntimeValue} from "@dawn/interpreter/RuntimeValue";

export class Environment {

  constructor(
    private readonly values: Map<string, RuntimeValue> = new Map(),
  ) {}

  get(name: string): RuntimeValue {
    const value = this.values.get(name);
    if(value) {
      return value;
    }

    throw new Error(`Undefined variable: ${name}`);
  }

  declare(name: string, value: any) {
    if (this.values.has(name)) {
      throw new Error(`Redeclaration of ${value} is not allowed`);
    }

    this.values.set(name, value);
  }
}

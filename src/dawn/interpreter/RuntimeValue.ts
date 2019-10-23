import {NativeType} from "@dawn/lang/NativeType";

export class RuntimeValue {

  static native(value: any, type: NativeType) {
    return new RuntimeValue(value, type.valueOf());
  }

  constructor(
    private readonly value: any,
    private readonly type: string,
  ) {}

  withValue(newValue: any) {
    return new RuntimeValue(newValue, this.type);
  }
}
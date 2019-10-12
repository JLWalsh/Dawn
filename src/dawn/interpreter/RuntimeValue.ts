export enum RuntimeType {
  INT,
  FLOAT
}

export interface RuntimeValue {
  value: any;
  type: RuntimeType;
}


export enum ValueType {
  INT,
  FLOAT,
  IDENTIFIER,
}

export interface Value {
  type: ValueType;
  value: any;
}
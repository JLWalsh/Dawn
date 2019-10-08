import {TokenType} from "@dawn/parsing/Token";

export enum NativeType {
  FLOAT,
  INT
}

export function tokenTypeToNativeType(tokenType: TokenType): NativeType {
  switch(tokenType) {
    case TokenType.FLOAT_NUMBER:
      return NativeType.FLOAT;
    case TokenType.INT_NUMBER:
      return NativeType.INT;
  }

  throw new Error(`Token of type ${tokenType} is not mapped to any native type`);
}

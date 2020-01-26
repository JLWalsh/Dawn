import {TokenType} from "@dawn/parsing/Token";

export enum PrimitiveType {
  FLOAT,
  INT,
}

export function tokenTypeToPrimitiveType(tokenType: TokenType): PrimitiveType {
  switch(tokenType) {
    case TokenType.FLOAT_NUMBER:
      return PrimitiveType.FLOAT;
    case TokenType.INT_NUMBER:
      return PrimitiveType.INT;
  }

  throw new Error(`Token of type ${tokenType} is not mapped to any primitive type`);
}

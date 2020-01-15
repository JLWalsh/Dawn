// import {NativeType} from "@dawn/lang/NativeType";
//
// export namespace Types {
//
//   export type Type = FunctionalType | StructuralType | PrimitiveType;
//
//   export class FunctionalType {
//
//     constructor(
//       private readonly args: Type[],
//       private readonly returnType: Type,
//     ) {}
//   }
//
//   export class StructuralType {
//
//     constructor(
//       private readonly vals: Map<string, Type> = new Map(),
//     ) {}
//
//     hasProperty(key: string): boolean {
//       return this.vals.has(key);
//     }
//
//     define(key: string, type: Type) {
//       this.vals.set(key, type);
//     }
//
//   }
//
//   export class PrimitiveType {
//
//     constructor(
//       private readonly type: NativeType
//     ) {}
//   }
// }

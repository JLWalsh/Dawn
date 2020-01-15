// import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
// import {Scope} from "@dawn/analysis/Scope";
// import {ObjectSymbol} from "@dawn/analysis/symbols/ObjectSymbol";
// import {TypeContext} from "@dawn/typechecking/TypeContext";
// import {SymbolResolver} from "@dawn/analysis/SymbolResolver";
// import {Accessor, describeAccessor} from "@dawn/lang/ast/Accessor";
// import {Types} from "@dawn/typechecking/Types";
// import {NativeType} from "@dawn/lang/NativeType";
// import {ISymbol} from "@dawn/analysis/symbols/ISymbol";
//
// export class TypeExpander {
//
//   constructor(
//     private readonly typeContext: TypeContext,
//     private readonly diagnostics: DiagnosticReporter,
//     private readonly symbolResolver: SymbolResolver,
//   ) {}
//
//   expandObjectType(objectToExpand: ObjectSymbol, previousExpandedSymbols: Set<ISymbol> = new Set()): Types.StructuralType | void {
//     if (previousExpandedSymbols.has(objectToExpand)) {
//       this.diagnostics.report("RECURSIVE_TYPE_NOT_ALLOWED", { templating: { type: objectToExpand.getName() }});
//       return;
//     }
//
//     previousExpandedSymbols.add(objectToExpand);
//
//     const expandedObjectType = new Types.StructuralType();
//
//     objectToExpand.values().forEach(value => {
//       const expandedType = this.expandObjectProperty(value.getType(), previousExpandedSymbols);
//       if (!expandedType)
//         return;
//
//       if (expandedObjectType.hasProperty(value.getName())) {
//         this.diagnostics.report("DUPLICATE_PROPERTY_FOR_TYPE", { templating: { type: objectToExpand.getName(), duplicateProperty: value.getName() }});
//         return;
//       }
//
//       expandedObjectType.define(value.getName(), expandedType);
//     });
//
//     this.typeContext.defineType(objectToExpand, expandedObjectType);
//
//     return expandedObjectType;
//   }
//
//   private expandObjectProperty(propertyType: Accessor, previousExpandedSymbols: Set<ISymbol>): Types.Type | void {
//     if (this.isNativeType(propertyType)) {
//       return new Types.PrimitiveType(propertyType.name as NativeType);
//     }
//
//     const resolvedSymbol = this.symbolResolver.resolve(propertyType, scopeOfObject);
//     if (!resolvedSymbol) {
//       const stringifiedAccessor = describeAccessor(propertyType);
//       this.diagnostics.report("TYPE_NOT_FOUND", { templating: { type: stringifiedAccessor }});
//       return;
//     }
//
//     const [symbol, scopeOfSymbol] = resolvedSymbol;
//
//     if (!(symbol instanceof ObjectSymbol)) {
//       this.diagnostics.report("SYMBOL_IS_NOT_A_VALID_TYPE", { templating: { symbol: symbol.getName() }});
//       return;
//     }
//
//     return this.expandObjectType(symbol, scopeOfSymbol as Scope, previousExpandedSymbols);
//   }
//
//   private isNativeType(typeReference: Accessor): boolean {
//     if (typeReference.subAccessor) {
//       return false;
//     }
//
//     const nativeTypes = Object.values(NativeType) as string[];
//
//     return nativeTypes.includes(typeReference.name);
//   }
// }

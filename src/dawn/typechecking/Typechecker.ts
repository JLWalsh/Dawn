// import {Program} from "@dawn/lang/ast/Program";
// import {Scope} from "@dawn/analysis/Scope";
// import {TypeContext} from "@dawn/typechecking/TypeContext";
// import {TypeExpander} from "@dawn/typechecking/TypeExpander";
// import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
// import {SymbolResolver} from "@dawn/analysis/SymbolResolver";
// import {ObjectSymbol} from "@dawn/analysis/symbols/ObjectSymbol";
// import {ISymbol, ISymbolVisitor} from "@dawn/analysis/symbols/ISymbol";
// import {ExportedSymbol} from "@dawn/analysis/symbols/ExportedSymbol";
// import {ValSymbol} from "@dawn/analysis/symbols/ValSymbol";
// import {ModuleSymbol} from "@dawn/analysis/symbols/ModuleSymbol";
// import {FunctionSymbol} from "@dawn/analysis/symbols/FunctionSymbol";
//
// export class Typechecker {
//
//   constructor(
//     private readonly diagnostics: DiagnosticReporter,
//     private readonly symbolResolver: SymbolResolver,
//   ) {}
//
//   typecheck(program: Program, globalScope: Scope): TypeContext {
//     const typeContext = new TypeContext();
//     const typeExpander = new TypeExpander(typeContext, this.diagnostics, this.symbolResolver);
//     const symbolTypechecker = new SymbolTypecheckerVisitor(typeContext, this.diagnostics, typeExpander);
//
//     globalScope.getAllSymbols().forEach(s => s.acceptSymbolVisitor(symbolTypechecker));
//
//     return typeContext;
//   }
//
//   private expandObjectTypesOf(scope: Scope, typeContext: TypeContext) {
//     const typeExpander = new TypeExpander(typeContext, this.diagnostics, this.symbolResolver);
//
//     for (const symbol of objectSymbols) {
//       typeExpander.expandObjectType(symbol, scope);
//
//       const scopeOfSymbol = symbol.getScope();
//       if (scopeOfSymbol) {
//         this.expandObjectTypesOf(scopeOfSymbol, typeContext);
//       }
//     }
//   }
//
//   private typecheckProgram(program: Program, globalScope: Scope, typeContext: TypeContext) {
//     const typecheckerVisitor = new ProgramTypecheckerVisitor();
//
//     program.body.forEach(entry => entry.acceptDeclarationVisitor(typecheckerVisitor));
//   }
// }
//
// class SymbolTypecheckerVisitor implements ISymbolVisitor<void> {
//
//   constructor(
//     private readonly typeContext: TypeContext,
//     private readonly diagnostics: DiagnosticReporter,
//     private readonly typeExpander: TypeExpander,
//   ) {}
//
//   visitFunctionSymbol(f: FunctionSymbol): void {
//     return undefined;
//   }
//
//   visitObjectSymbol(o: ObjectSymbol): void {
//     this.typeExpander.expandObjectType(o)
//   }
//
//   visitValSymbol(v: ValSymbol): void {
//     return undefined;
//   }
//
//   visitExportedSymbol(e: ExportedSymbol): void {
//     // Do nothing
//   }
//
//   visitModuleSymbol(m: ModuleSymbol): void {
//     // Do nothing
//   }
//
// }

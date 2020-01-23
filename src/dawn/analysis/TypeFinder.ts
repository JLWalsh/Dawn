import {Program} from "@dawn/lang/ast/Program";
import {DiagnosticReporter} from "@dawn/ui/DiagnosticReporter";
import {ModuleDeclaration} from "@dawn/lang/ast/declarations/ModuleDeclaration";
import {ModuleType} from "@dawn/analysis/types/ModuleType";
import {DeclarationVisitor} from "@dawn/lang/ast/DeclarationNode";
import {Export} from "@dawn/lang/ast/Export";
import {FunctionDeclaration} from "@dawn/lang/ast/declarations/FunctionDeclaration";
import {Import} from "@dawn/lang/ast/Import";
import {ObjectDeclaration} from "@dawn/lang/ast/declarations/ObjectDeclaration";
import {ValDeclaration} from "@dawn/lang/ast/declarations/ValDeclaration";
import {Types} from "@dawn/analysis/types/Types";
import {Type, TypeVisibility} from "@dawn/analysis/types/Type";

export namespace TypeFinder {

  export interface ProgramTypes {
    types: Map<ModuleDeclaration, ModuleType>;
  }

  export function findAllTypes(program: Program, diagnostics: DiagnosticReporter): ProgramTypes {
    const visitor = new TypeFinderVisitor(diagnostics);

    return visitor.findAllTypesOf(program);
  }

  class TypeFinderVisitor implements DeclarationVisitor<void> {

    private programTypes!: ProgramTypes;
    private currentModule!: ModuleType;
    private exportNextType!: boolean;

    constructor(
      private readonly diagnostics: DiagnosticReporter,
    ) {}

    findAllTypesOf(program: Program): ProgramTypes {
      this.programTypes = { types: new Map() };
      this.exportNextType = false;
      this.currentModule = Types.newModuleType(TypeVisibility.INTERNAL);

      program.body.forEach(declaration => declaration.acceptDeclarationVisitor(this));

      return this.programTypes;
    }

    visitModuleDeclaration(m: ModuleDeclaration): void {
      const parentModule = this.currentModule;
      this.currentModule = Types.newModuleType(this.determineTypeVisibility(), parentModule);

      m.body.forEach(declaration => declaration.acceptDeclarationVisitor(this));

      this.defineTypeInModule(parentModule, m.name, this.currentModule);
      this.currentModule = parentModule;
    }

    visitObjectDeclaration(o: ObjectDeclaration): void {
      const objectType = Types.newObjectType(this.determineTypeVisibility());

      this.defineTypeInModule(this.currentModule, o.name, objectType);
    }

    // Not needed for this pass
    visitFunctionDeclaration(f: FunctionDeclaration): void {}
    visitImport(i: Import): void {}
    visitExport(e: Export): void {}
    visitValDeclaration(v: ValDeclaration): void {}

    private defineTypeInModule(module: ModuleType, typeName: string, type: Type) {
      if (module.members.has(typeName)) {
        this.diagnostics.report("REDEFINITION_OF_TYPE", { templating: { typeName } });
        return;
      }

      module.members.set(typeName, type);
    }

    private determineTypeVisibility(): TypeVisibility {
      const visibility = this.exportNextType ? TypeVisibility.EXPORTED : TypeVisibility.INTERNAL;
      this.exportNextType = false;

      return visibility;
    }
  }
}
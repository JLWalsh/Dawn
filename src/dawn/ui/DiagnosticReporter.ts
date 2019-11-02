import {AstNode} from "@dawn/lang/ast/AstNode";

export interface DiagnosticMetadata {
  subjects?: AstNode[];
}

export interface DiagnosticTemplateValues {
  [key: string]: string | number;
}

export interface DiagnosticReporter {
  report(messageCode: string, templatedValues?: DiagnosticTemplateValues, metadata?: DiagnosticMetadata): void;
  reportRaw(rawMessage: string): void;
}

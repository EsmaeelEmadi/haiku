import type { SourceFile } from "typescript";

export interface IGenenrateStorybook {
  outputDirectory: string;
  srcDirectory: string;
}

export interface IMatch {
  filePath: string;
  args: string[];
  content: string;
  sourceFile: SourceFile;
}

export interface ISource {
  filePath: string;
  calls: Array<Record<string, unknown>>;
}

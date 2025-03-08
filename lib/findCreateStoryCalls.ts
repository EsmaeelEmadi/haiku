import { readFileSync } from "node:fs";
import { ScriptTarget, createSourceFile } from "typescript";
import { forEachChild, isCallExpression, isIdentifier } from "typescript";
import { TARGET_FUNC } from "./constants";
import type { IMatch } from "./types";

export function findCreateStoryCalls(filePath: string) {
  const content = readFileSync(filePath, "utf-8");

  const sourceFile = createSourceFile(
    filePath,
    content,
    ScriptTarget.ESNext,
    true,
  );

  const matches: IMatch[] = [];

  // FIXME:
  // biome-ignore lint/suspicious/noExplicitAny: I can't find a better way right now
  function visit(node: any) {
    if (
      isCallExpression(node) &&
      isIdentifier(node.expression) &&
      node.expression.text === TARGET_FUNC
    ) {
      const args = node.arguments.map((arg) => arg.getText(sourceFile));
      matches.push({ filePath, args, content, sourceFile });
    }
    forEachChild(node, visit);
  }

  visit(sourceFile);

  return matches;
}

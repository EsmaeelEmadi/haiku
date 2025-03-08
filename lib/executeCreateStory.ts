import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "@babel/parser";
import type { SourceFile } from "typescript";
import { extract } from "./extractor/extractor";
import { store } from "./store";
import { traverse } from "./traverse";

import { internalCreateStory } from "./internalCreateStory";

export async function executeCreateStory(
  filePath: string,
  sourceFile: SourceFile,
) {
  const sourceContent = sourceFile.getText();
  const ast = parse(sourceContent, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
    attachComment: false,
  });

  traverse(ast, {
    CallExpression(path) {
      if (
        path.node.callee.type === "Identifier" &&
        path.node.callee.name === "$CreateStory"
      ) {
        const result = extract(ast, path, filePath);

        if (result) {
          internalCreateStory(result).then((story) => {
            const outputStoryPath = join(
              process.cwd(),
              store.outputDirectory,
              result.component.name,
            );

            writeFileSync(`${outputStoryPath}.stories.tsx`, story, "utf8");
          });
        }
      }
    },
  });
}

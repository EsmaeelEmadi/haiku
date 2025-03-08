import type { NodePath } from "@babel/traverse";
import type { CallExpression, File } from "@babel/types";
import type { Node } from "@babel/types";
import { match } from "ts-pattern";
import { ExtractResult } from "../helperClasses";
import { extractComponentPath } from "./extractComponentPath";
import { extractObjectProperty } from "./extractObjectProperty";

export const extract = (
  ast: File,
  path: NodePath<CallExpression>,
  filePath: string,
) => {
  const args = path.node.arguments;

  const node = args[0];

  const componentPath = extractComponentPath(
    // FIXME:
    // @ts-ignore
    node.name,
    filePath,
    path,
    "JSXElement",
  );

  if (!node) throw new Error();

  let properties: Node | undefined;

  if (args.length > 1 && args[1].type === "ObjectExpression") {
    for (const objectProperty of args[1].properties) {
      match(objectProperty)
        .with({ type: "ObjectMethod" }, () => {
          throw new Error("wtf, ObjectMethod");
        })
        .with({ type: "SpreadElement" }, () => {
          throw new Error("wtf SpreadElement");
        })
        .with({ type: "ObjectProperty" }, (prop) => {
          const values = extractObjectProperty(ast, prop, filePath, path);
          // FIXME:
          // @ts-ignore
          properties[prop.key.name] = values;
        })
        .exhaustive();
    }
  }

  if (componentPath) {
    return new ExtractResult(componentPath, properties);
  }
};

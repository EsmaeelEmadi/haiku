import type { NodePath } from "@babel/traverse";
import type { CallExpression, File, ObjectProperty } from "@babel/types";
import { extract } from "./extract";

export const extractObjectProperty = (
  ast: File,
  prop: ObjectProperty,
  filePath: string,
  path: NodePath<CallExpression>,
) => {
  return extract(ast, prop.value, filePath, path);
};

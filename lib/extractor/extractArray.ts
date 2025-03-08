import type { NodePath } from "@babel/traverse";
import type { ArrayExpression, CallExpression, File } from "@babel/types";
import { extract } from "./extract";

export const extractArray = (
  ast: File,
  node: ArrayExpression,
  filePath: string,
  path: NodePath<CallExpression>,
): Array<unknown> => {
  const res: Array<unknown> = [];
  for (const element of node.elements) {
    if (element !== null) {
      const v = extract(ast, element, filePath, path);
      res.push(v);
    } else {
      res.push(null);
    }
  }
  return res;
};

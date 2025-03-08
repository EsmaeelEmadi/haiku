import type { NodePath } from "@babel/traverse";
import type { CallExpression, File, Identifier } from "@babel/types";
import { extract } from "./extract";
import { extractComponentPath } from "./extractComponentPath";

export const extractIdentifier = (
  ast: File,
  node: Identifier,
  filePath: string,
  path: NodePath<CallExpression>,
): unknown => {
  const body = ast.program.body;
  for (const item of body) {
    if (item.type === "TSInterfaceDeclaration") {
      continue;
    }

    if (item.type === "FunctionDeclaration") {
      throw new Error();
    }

    if (item.type === "VariableDeclaration") {
      if (item.declarations) {
        for (const dec of item.declarations) {
          // FIXME:
          // @ts-ignore
          if (dec.id.name === node.name) {
            return extract(ast, dec, filePath, path);
          }
        }
      }
    } else if (item.type === "ExportNamedDeclaration") {
      const el = extractComponentPath(node.name, filePath, path, item.type);
      return el;
    }
  }

  throw new Error();
};

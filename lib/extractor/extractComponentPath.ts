import type { NodePath } from "@babel/traverse";
import type { CallExpression } from "@babel/types";
import { store } from "../store";
import { extractImportAddress } from "./extractImportAddress";

import {
  DefaultExport,
  DefaultImport,
  NamedExport,
  NamedImport,
} from "../helperClasses";

export const extractComponentPath = (
  componentIdentifier: string,
  filePath: string,
  path: NodePath<CallExpression>,
  type: string,
) => {
  const binding = path.scope.getBinding(componentIdentifier);

  if (!binding) throw new Error();

  if (binding.path.parent.type === "ExportNamedDeclaration") {
    return new NamedExport(
      componentIdentifier,
      store.componentRelativePathToStoriesDirectory(filePath),
      type,
    );
  }

  if (binding.path.parent.type === "Program") {
    return new DefaultExport(
      componentIdentifier,
      store.componentRelativePathToStoriesDirectory(filePath),
      type,
    );
  }

  if (binding.path.parent.type === "ImportDeclaration") {
    const importFilePath = extractImportAddress(
      binding.path.parent.source.value,
      filePath,
    );
    if (binding.path.type === "ImportDefaultSpecifier") {
      return new DefaultImport(componentIdentifier, importFilePath, type);
    }

    if (binding.path.type === "ImportSpecifier") {
      return new NamedImport(componentIdentifier, importFilePath, type);
    }
  }
};

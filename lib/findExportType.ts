import fs from "node:fs";
import ts from "typescript";

type TExportType = "named" | "default";

export function findExportType(
  filePath: string,
  componentName: string,
): TExportType {
  const content = fs.readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.ESNext,
    true,
  );

  let exportType: TExportType = "named";

  // FIXME:
  // biome-ignore lint/suspicious/noExplicitAny: I can't find a better way right now
  function visit(node: any) {
    if (ts.isExportAssignment(node)) {
      exportType = "default";
    }

    if (ts.isVariableStatement(node)) {
      const isExported = node.modifiers?.some(
        (mod) => mod.kind === ts.SyntaxKind.ExportKeyword,
      );
      if (isExported) {
        const declarations = node.declarationList.declarations;

        for (const decl of declarations) {
          // FIXME:
          // @ts-ignore
          if (decl.name.text === componentName) {
            exportType = "named";
          }
        }
      }
    }

    if (ts.isFunctionDeclaration(node)) {
      const isExported = node.modifiers?.some(
        (mod) => mod.kind === ts.SyntaxKind.ExportKeyword,
      );
      if (isExported && node.name?.text === componentName) {
        exportType = "named";
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return exportType;
}

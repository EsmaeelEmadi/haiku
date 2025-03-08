import path from "node:path";
import { store } from "../store";

export const extractImportAddress = (importPath: string, filePath: string) => {
  if (importPath.startsWith("./")) {
    const dir = filePath.split("/").slice(0, -1).join("/");
    const relativeImportPath = path.join(dir, importPath);
    return store.componentRelativePathToStoriesDirectory(relativeImportPath);
  }

  if (importPath.startsWith("../")) {
    const splittedPath = importPath.split("/");
    const numberOfBacks = splittedPath.filter((item) => item === "..").length;
    const pathWithoutBacks = splittedPath
      .filter((item) => item !== "..")
      .join("/");
    const dir = filePath
      .split("/")
      .slice(0, -numberOfBacks - 1)
      .join("/");

    const relativeImportPath = path.join(dir, pathWithoutBacks);

    return store.componentRelativePathToStoriesDirectory(relativeImportPath);
  }

  return importPath;
};

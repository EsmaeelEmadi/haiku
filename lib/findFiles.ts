import fs from "node:fs";
import path from "node:path";

export function findFiles(dir: string, out: string, fileList: string[] = []) {
  if (dir.startsWith(out)) return null;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (file.startsWith(out) || files.includes(".story")) return null;

    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findFiles(filePath, out, fileList);
    } else if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

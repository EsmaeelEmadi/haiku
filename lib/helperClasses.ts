import type { Node } from "@babel/types";

export class Export {
  constructor(
    public readonly name: string,
    public readonly path: string,
    public readonly type: string,
  ) {}

  get pathWithoutExtention() {
    return this.path.replace(/\.(ts|tsx)$/, "");
  }
}

export class DefaultExport extends Export {}

export class NamedExport extends Export {}

export class DefaultImport extends Export {}

export class NamedImport extends Export {}

export class ExtractResult {
  constructor(
    readonly component: Export,
    readonly props?: Node,
  ) {
    console.log(props);
  }
}

export class ImportDeclaration {
  constructor(
    public readonly name: string,
    public readonly path: string,
  ) {}
}

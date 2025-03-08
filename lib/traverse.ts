import _traverse from "@babel/traverse";

export const traverse =
  typeof _traverse === "object"
    ? // biome-ignore lint/suspicious/noExplicitAny: I can't find a better way right now
      ((_traverse as any).default as typeof _traverse)
    : _traverse;

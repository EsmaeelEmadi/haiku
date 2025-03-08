export const $CreateStory = async <
  // biome-ignore lint/suspicious/noExplicitAny: I can't find a better way right now
  T extends (props: any) => any,
  D extends Parameters<T>[0],
  L extends { [K in keyof D as `$_${string & K}`]?: D[K] },
  P extends { query: Record<string, string | number> },
>(
  _component: T,
  _defaults: D & L,
  _params?: P,
) => {};

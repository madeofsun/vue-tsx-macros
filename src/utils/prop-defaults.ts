export type InferDefaults<T> = {
  [P in keyof T]?: InferDefault<T, NotUndefined<T[P]>>;
};

type InferDefault<P, T> = T extends
  | null
  | number
  | string
  | boolean
  | symbol
  | Function
  ? T | ((props: P) => T)
  : (props: P) => T;

export type PropsWithDefaults<Base, Defaults> = Base & {
  [K in keyof Defaults]: K extends keyof Base ? NotUndefined<Base[K]> : never;
};

type NotUndefined<T> = T extends undefined ? never : T;

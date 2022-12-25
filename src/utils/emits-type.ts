import { ObjectEmitsOptions } from "vue";

export type EmitProps<E extends ObjectEmitsOptions> = {
  [K in keyof E as K extends string ? `on${Capitalize<K>}` : never]?:
    | E[K]
    | undefined;
};

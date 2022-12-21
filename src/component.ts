import type {
  ComponentPropsOptions,
  DefineComponent,
  ExtractPropTypes,
  FunctionalComponent,
  RenderFunction,
  SetupContext,
  VNodeChild,
} from "vue";

import type { InferDefaults, PropsWithDefaults } from "./utils/prop-defaults";
import { RuntimeUsageError } from "./utils/runtime-usage-error";

interface CustomExpose {
  (exposed?: Record<string, any>): void;
  /** In runtime returns RenderFunction */
  <T extends Record<string, any>>(exposed: T, render: RenderFunction): T;
}

type ComponentFactory<P = {}, Defaults = {}> = {
  define: <RawBindings>(
    setup: (
      props: Readonly<PropsWithDefaults<P, Defaults>>,
      context: Omit<SetupContext, "expose"> & { expose: CustomExpose }
    ) => RawBindings | RenderFunction
  ) => DefineComponent<P, RawBindings>;
  functional: (
    render: (
      props: PropsWithDefaults<P, Defaults>,
      context: Omit<SetupContext, "expose">
    ) => VNodeChild
  ) => FunctionalComponent<P>;
};

export function component$(): ComponentFactory;
export function component$<P extends ComponentPropsOptions>(
  props: P
): ComponentFactory<ExtractPropTypes<P>>;
export function component$<P>(): ComponentFactory<P> & {
  withDefaults: <D extends InferDefaults<P>>(
    defaults: D
  ) => ComponentFactory<P, D>;
};
export function component$(props?: unknown): never {
  throw new RuntimeUsageError("component$");
}

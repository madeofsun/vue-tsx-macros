import type {
  ComponentPropsOptions,
  ExtractPropTypes,
  FunctionalComponent,
  ObjectEmitsOptions,
  RenderFunction,
  SetupContext,
  VNodeChild,
} from "vue";
import type { DefineComponentSimple } from "./utils/define-component-simple";
import type { EmitProps } from "./utils/emits-type";
import type { InferDefaults, PropsWithDefaults } from "./utils/prop-defaults";

import { RuntimeUsageError } from "./utils/runtime-usage-error";

type Exposed = Record<string, any>;

type ComponentFactory<
  P = {},
  Defaults = {},
  E extends ObjectEmitsOptions = {}
> = {
  define<RawBindings extends Exposed>(
    setup: (
      props: Readonly<PropsWithDefaults<P, Defaults>>,
      context: Omit<SetupContext<E>, "expose">
    ) => RenderFunction | RawBindings
  ): DefineComponentSimple<P, E, RawBindings>;

  functional(
    render: (
      props: PropsWithDefaults<P, Defaults>,
      context: Omit<SetupContext<E>, "expose">
    ) => VNodeChild
  ): FunctionalComponent<P & EmitProps<E>, E>;
};

export function component$(): ComponentFactory;

export function component$<P>(): {
  withDefaults: <D extends InferDefaults<P>>(
    defaults: D
  ) => ComponentFactory<P, D>;
} & ComponentFactory<P>;

export function component$<P, E extends ObjectEmitsOptions>(): {
  withDefaults: <D extends InferDefaults<P>>(
    defaults: D
  ) => ComponentFactory<P, D, E>;
} & ComponentFactory<P, {}, E>;

export function component$<P extends ComponentPropsOptions>(
  props: P
): ComponentFactory<ExtractPropTypes<P>>;

export function component$<
  P extends ComponentPropsOptions,
  E extends ObjectEmitsOptions
>(props: P, emits: E): ComponentFactory<ExtractPropTypes<P>, E>;

export function component$(props?: unknown): never {
  throw new RuntimeUsageError({ macro: "component$" });
}

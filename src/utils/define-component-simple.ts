import {
  ComponentOptionsMixin,
  ComputedOptions,
  DefineComponent,
  EmitsOptions,
  MethodOptions,
} from "vue";

export type DefineComponentSimple<
  P,
  E extends EmitsOptions,
  RawBindings = {}
> = DefineComponent<
  P,
  RawBindings,
  {},
  ComputedOptions,
  MethodOptions,
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  E
>;

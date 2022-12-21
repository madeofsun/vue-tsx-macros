import { component$, defaultProps$ } from "vue-tsx-macros";

export interface ExampleProps {
  color?: "red" | "blue";
  counter: number;
  array?: string[];
}

export const defaults = defaultProps$<ExampleProps>()({
  color: "red",
  boolean: false,
  array: () => [],
});

export const Example = component$<ExampleProps>()
  .withDefaults(defaults)
  .define((props) => {
    return () => {
      const color: "red" | "blue" = props.color;
      return <div>{color}</div>;
    };
  });

export const Example2 = component$<ExampleProps>()
  .withDefaults({ color: "red" })
  .define((props) => {
    return () => {
      const color: "red" | "blue" = props.color;
      return <div>{color}</div>;
    };
  });

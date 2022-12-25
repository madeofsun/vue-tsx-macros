import { component$, defaultProps$ } from "vue-tsx-macros";

// reference
export interface ExampleProps {
  counter: number;
  color?: "red" | "blue";
  array?: string[];
}

export const exampleDefaults = defaultProps$<ExampleProps>()({
  color: "red",
  array: () => [],
});

export const Example = component$<ExampleProps>()
  .withDefaults(exampleDefaults)
  .define((props) => {
    return () => (
      <div>
        {props.counter.toFixed()}
        {props.color.trim()}
        {props.array.slice()}
      </div>
    );
  });

<Example counter={0} color={"red"} />;

// literal
export const Example1 = component$<{
  color?: "red" | "blue";
  counter: number;
  array?: string[];
}>()
  .withDefaults({
    color: "red",
    array: () => [],
  })
  .define((props) => {
    return () => (
      <div>
        {props.counter.toFixed()}
        {props.color.trim()}
        {props.array.slice()}
      </div>
    );
  });

<Example1 counter={0} color={"red"} />;

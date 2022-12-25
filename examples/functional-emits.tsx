import { component$ } from "vue-tsx-macros";

export type ExampleProps = {
  color?: "red" | "blue";
  counter: number;
};

export type ExampleEmits = {
  change: (value: number) => void;
  update: (value: string) => void;
};

export const Example = component$<ExampleProps, ExampleEmits>().functional(
  (props, { emit }) => {
    return (
      <button
        data-color={props.color?.trim()}
        onClick={() => {
          emit("change", 0);
          emit("update", "");
        }}
      >
        {props.counter.toFixed()}
      </button>
    );
  }
);

<Example counter={0} onChange={(value) => value.toFixed()} />;

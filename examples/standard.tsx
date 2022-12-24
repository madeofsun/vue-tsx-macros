import { onMounted } from "vue";
import { component$ } from "vue-tsx-macros";

// literal
export const Example = component$<{
  color?: "red" | "blue";
  counter: number;
}>().define((props) => {
  onMounted(() => {
    console.log("mounted");
  });

  return () => (
    <div>
      {props.counter.toFixed()}
      {props.color?.trim()}
    </div>
  );
});

<Example counter={0} color={"red"} />;

// interface
export interface Example1Props {
  color?: "red" | "blue";
  counter: number;
}

export const Example1 = component$<Example1Props>().define((props) => {
  onMounted(() => {
    console.log("mounted");
  });

  return () => (
    <div>
      {props.counter.toFixed()}
      {props.color?.trim()}
    </div>
  );
});

// type
export type Example2Props = {
  color?: "red" | "blue";
  counter: number;
  array?: string[];
};

export const Example2 = component$<Example2Props>().define((props) => {
  onMounted(() => {
    console.log("mounted");
  });

  return () => (
    <div>
      {props.counter.toFixed()}
      {props.color?.trim()}
    </div>
  );
});

// ComponentPropsOptions
export const Example3 = component$({ color: String }).define((props) => {
  onMounted(() => {
    console.log("mounted");
  });

  return () => <div>{props.color?.trim()}</div>;
});

// name from function
export default component$().define(function DefaultExample() {
  onMounted(() => {
    console.log("mounted");
  });

  return () => <div />;
});

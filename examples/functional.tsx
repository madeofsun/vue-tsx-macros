import { component$ } from "vue-tsx-macros";

// literal
export const Example = component$<{
  color?: "red" | "blue";
  counter: number;
}>().functional((props) => {
  return (
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

export const Example1 = component$<Example1Props>().functional((props) => {
  return (
    <div>
      {props.counter.toFixed()}
      {props.color?.trim()}
    </div>
  );
});

<Example1 counter={0} color={"red"} />;

// type
export type Example2Props = {
  color?: "red" | "blue";
  counter: number;
};

export const Example2 = component$<Example2Props>().functional((props) => {
  return (
    <div>
      {props.counter.toFixed()}
      {props.color?.trim()}
    </div>
  );
});

<Example2 counter={0} color={"red"} />;

// explicit
export const Example3 = component$({ color: String }).functional((props) => {
  return <div>{props.color?.trim()}</div>;
});

<Example3 />;

export default component$().functional(function DefaultExample() {
  return <div />;
});

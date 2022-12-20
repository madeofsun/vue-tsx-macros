import { $component } from "vue-tsx-macros";

export interface ExampleProps {
  color?: "red" | "blue";
  counter: number;
  array?: string[];
}

export default $component().define(function DefaultExample() {
  return <div></div>;
});

export const Example = $component<ExampleProps>().define((props) => {
  return () => {
    const color: string | undefined = props.color;
    const counter: number = props.counter;
    return (
      <div>
        {counter}
        {color}
      </div>
    );
  };
});

export const Example1 = $component<{
  color?: "red" | "blue";
  counter: number;
  array?: string[];
}>().define((props) => {
  return () => {
    const color: string | undefined = props.color;
    const counter: number = props.counter;
    return (
      <div>
        {counter}
        {color}
      </div>
    );
  };
});

export type Example2Props = {
  color?: "red" | "blue";
  counter: number;
  array?: string[];
};

export const Example2 = $component<Example2Props>().define((props) => {
  return () => {
    const color: string | undefined = props.color;
    const counter: number = props.counter;
    return (
      <div>
        {counter}
        {color}
      </div>
    );
  };
});

export const Example3 = $component({ color: { type: String } }).define(
  (props) => {
    return () => {
      const color: string | undefined = props.color;
      return <div>{color}</div>;
    };
  }
);

import { $component } from "vue-tsx-macros";

export interface ExampleProps {
  color?: "red" | "blue";
  counter: number;
  array?: string[];
}

export const Example = $component<ExampleProps>().functional((props) => {
  const color: string | undefined = props.color;
  const counter: number = props.counter;
  return (
    <div>
      {counter}
      {color}
    </div>
  );
});

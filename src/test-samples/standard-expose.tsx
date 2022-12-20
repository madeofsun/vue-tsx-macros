import { $component } from "vue-tsx-macros";
import { ref } from "vue";

export interface ExampleProps {
  color?: "red" | "blue";
  counter: number;
  array?: string[];
}

export const Example1 = $component<ExampleProps>().define(
  (props, { expose }) => {
    const list = ref(props.array);

    return expose({ list }, () => <div>{props.counter}</div>);
  }
);

const instance = null as unknown as InstanceType<typeof Example1>;

console.log(instance.list?.[0]?.trim());

export const Example2 = $component<ExampleProps>().define(
  (props, { expose }) => {
    const list = ref(props.array);
    return expose({ list }, () => <div>{props.counter}</div>);
  }
);

export const Example3 = $component<ExampleProps>().define(
  (props, { expose }) => {
    const list = ref(props.array);
    return expose({ list });
  }
);

export const Example4 = $component<ExampleProps>().define((props, context) => {
  const list = ref(props.array);
  return context.expose({ list });
});

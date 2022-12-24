import { component$ } from "vue-tsx-macros";
import { ref } from "vue";

export interface ExampleProps {
  counter: number;
  array?: string[];
}

export const Example1 = component$<ExampleProps>().define(
  (props, { expose }) => {
    const list = ref(props.array);

    return expose({ list }, () => <div>{props.counter.toFixed()}</div>);
  }
);

const instance1 = null as unknown as InstanceType<typeof Example1>;
console.log(instance1.list?.[0]?.trim());

import { component$, useRender$ } from "vue-tsx-macros";
import { ref } from "vue";

export const Example = component$().define(() => {
  const counter = ref(0);

  const increment = () => (counter.value += 1);

  useRender$(() => <button onClick={increment}>{counter.value}</button>);

  return { increment };
});

const instance = null as unknown as InstanceType<typeof Example>;
console.log(instance.increment().toFixed());

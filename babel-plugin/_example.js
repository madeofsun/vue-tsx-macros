const console = require("node:console");
const babel = require("@babel/core");
const plugin = require("./index.js");

const code = `
import { component$, useRender$ } from "vue-tsx-macros";
import { ref } from "vue";

export const Example = component$().define((props) => {
  const counter = ref(0);
  useRender$(() => <button onClick={increment}>{counter.value}</button>);
  return { increment };
});
`;

const res = babel.transformSync(code, {
  plugins: [["@babel/plugin-syntax-typescript", { isTSX: true }], plugin],
});

console.log(res?.code);

const console = require("node:console");
const babel = require("@babel/core");
const plugin = require("./index.js");

const code = `
import { $component } from "vue-tsx-macros";

export interface ExampleProps {
  size?: 300 | 400 | 500 | 600;
}

export const Example = $component<ExampleProps>().functional((props) => {
  return null
});
`;

const res = babel.transformSync(code, {
  plugins: [["@babel/plugin-syntax-typescript", { isTSX: true }], plugin],
});

console.log(res?.code);

const console = require("node:console");
const babel = require("@babel/core");
const plugin = require("./index.js");

const code = `
import { component$ } from 'vue-tsx-macros';

export const Example = component$<{ size?: number }>().functional(
  ({ size = 500 }) => {
    return <div data-size={size} />;
  }
);
`;

const res = babel.transformSync(code, {
  plugins: [["@babel/plugin-syntax-typescript", { isTSX: true }], plugin],
});

console.log(res?.code);

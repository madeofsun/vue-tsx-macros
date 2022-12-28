const console = require("node:console");
const babel = require("@babel/core");
const plugin = require("./index.js");

const code = `
import { component$ } from "vue-tsx-macros";
const Comp = component$().withDefaults().define(() => null);
`;

const res = babel.transformSync(code, {
  plugins: [["@babel/plugin-syntax-typescript", { isTSX: true }], plugin],
});

console.log(res?.code);

const console = require("node:console");
const transformWithPlugin = require("./helpers/transform-with-plugin.js");

const code = `
import { component$ } from "vue-tsx-macros";
const Comp = component$().withDefaults().define(() => null);
`;

const res = transformWithPlugin(code, {});

console.log(res);

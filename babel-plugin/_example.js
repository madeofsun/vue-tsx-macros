const console = require("node:console");
const transformWithPlugin = require("./helpers/transform-with-plugin.js");

const code = `
import { component$, useRender$ } from "vue-tsx-macros";
import { ref } from "vue";
const Comp = component$().withDefaults({}).define(() => {
  useRender$(() => null)
  return null
});
`;

const res = transformWithPlugin(code, {});

console.log(res);

const transformWithPlugin = require("../helpers/transform-with-plugin");

describe("imports", () => {
  describe("defineComponent for component$().define()", () => {
    test("add import", () => {
      expect(
        transformWithPlugin(
          `import { component$ } from "vue-tsx-macros";
import { ref } from "vue";
export const Component = component$().define(() => () => null);`,
          {}
        )
      ).toBe(`import { defineComponent } from "vue";
import { ref } from "vue";
export const Component = defineComponent({
  name: "Component",
  setup: () => () => null
});`);
    });

    test("do not add import", () => {
      expect(
        transformWithPlugin(
          `import { component$ } from "vue-tsx-macros";
export const Component = component$().functional(() => null);`,
          {}
        )
      ).toBe(`export const Component = Object.assign(() => null, {
  displayName: "Component"
});`);

      expect(
        transformWithPlugin(
          `import { component$ } from "vue-tsx-macros";
import { ref, defineComponent } from "vue";
export const Component = component$().define(() => () => null);`,
          {}
        )
      ).toBe(`import { ref, defineComponent } from "vue";
export const Component = defineComponent({
  name: "Component",
  setup: () => () => null
});`);

      expect(
        transformWithPlugin(
          `import { component$ } from "vue-tsx-macros";
import { computed } from "vue";
import { defineComponent } from "vue";
import { ref } from "vue";
export const Component = component$().define(() => () => null);`,
          {}
        )
      ).toBe(`import { computed } from "vue";
import { defineComponent } from "vue";
import { ref } from "vue";
export const Component = defineComponent({
  name: "Component",
  setup: () => () => null
});`);
    });
  });
});

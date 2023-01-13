const { COMPONENT_MACRO } = require("../constants");
const makeExpectThrows = require("../helpers/make-expect-throws");

describe("options", () => {
  describe("allowEmits: false", () => {
    const expectThrows = makeExpectThrows(COMPONENT_MACRO, {
      allowEmits: false,
    });
    test("with type argument", () => {
      expectThrows(
        `
        import { component$ } from "vue-tsx-macros";
        const Comp = component$<{}, { update: () => void }>().define(() => () => null);
        `,
        "emits are not allowed"
      );
    });
    test("with runtime argument", () => {
      expectThrows(
        `
        import { component$ } from "vue-tsx-macros";
        const Comp = component$({}, { update: null as unknown as () => void }).define(() => () => null);
        `,
        "emits are not allowed"
      );
    });
  });
});

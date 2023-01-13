const {
  COMPONENT_MACRO,
  USE_RENDER_MACRO,
  DEFAULT_PROPS_MACRO,
} = require("../constants");
const makeExpectThrows = require("../helpers/make-expect-throws");

describe("errors", () => {
  test("macro is not call expression", () => {
    makeExpectThrows()(
      `
      import { component$ } from "vue-tsx-macros";
      const Comp = component$;
      `,
      'must be used as "CallExpression"'
    );
  });

  describe(COMPONENT_MACRO, () => {
    const expectThrows = makeExpectThrows(COMPONENT_MACRO);

    describe("component", () => {
      test("is not member expression", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        const Comp = component$();
        `,
          '"MemberExpression" is expected'
        );
      });

      test("is not identifier", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        const Comp = component$()['define'];
        `,
          '"Identifier" is expected'
        );
      });

      test("is not call expression", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        const Comp = component$().define;
        `,
          '"CallExpression" is expected'
        );
      });

      test("method is not supported", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        const Comp = component$().some();
        `,
          '"some" is not supported'
        );
      });

      test("argument is not provided", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        const Comp = component$().define();
        `,
          "argument is not provided"
        );
      });

      test('argument is not "Expression"', () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        const Comp = component$().define(...[]);
        `,
          'argument is not "Expression'
        );
      });
    });

    describe("component with default props", () => {
      test("is not member expression", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        const Comp = component$().withDefaults({});
        `,
          '"MemberExpression" is expected'
        );
      });

      test("is not identifier", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        const Comp = component$().withDefaults({})['define'];
        `,
          '"Identifier" is expected'
        );
      });

      test("is not call expression", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        const Comp = component$().withDefaults({}).define;
        `,
          '"CallExpression" is expected'
        );
      });

      test("method not supported", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        const Comp = component$().withDefaults({}).some();
        `,
          '"some" is not supported'
        );
      });

      test("argument is not provided", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        const Comp = component$().withDefaults().define();
        `,
          "argument is not provided"
        );
      });

      test("argument is not expression", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        const Comp = component$().withDefaults().define(...[]);
        `,
          'argument is not "Expression"'
        );
      });
    });

    describe("props", () => {
      test("kind of type is not supported", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        type A = { a: string };
        const Comp = component$<{ some: string } & A>().define(() => null);
        `,
          'must be a "TypeLiteral" or a "TypeReference"'
        );
      });

      test("kind of type is not supported in TypeReference", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        type A = { a: string };
        type Props = { some: string } & A;
        const Comp = component$<Props>().define(() => null);
        `,
          'Right-side expression must be a "TypeLiteral"'
        );
      });

      test("type members are not string keys", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        interface CompProps {
          [k: string]: unknown
        }
        const Comp = component$<CompProps>().define(() => null);
        `,
          "type must use only explicitly defined string keys"
        );
      });

      test("type is not found", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        import { CompProps } from "./comp-props";
        const Comp = component$<CompProps>().define(() => null);
        `,
          "not defined in the current file"
        );
      });

      test("argument is not expression", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        const some = {};
        const Comp = component$(...some).define(() => null);
        `,
          'argument is not "Expression"'
        );
      });
    });

    describe("emits", () => {
      test("kind of type is not supported", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        type A = { update: () => void };
        const Comp = component$<{}, { change: () => void } & A>().define(() => null);
        `,
          'must be a "TypeLiteral" or a "TypeReference"'
        );
      });

      test("kind of type is not supported in TypeReference", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        type A = { update: () => void };
        type Emits = { change: () => void } & A;
        const Comp = component$<{}, Emits>().define(() => null);
        `,
          'Right-side expression must be a "TypeLiteral"'
        );
      });

      test("type members are not string keys", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        interface CompEmits {
          [k: string]: unknown
        }
        const Comp = component$<{}, CompEmits>().define(() => null);
        `,
          "type must use only explicitly defined string keys"
        );
      });

      test("type is not found", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        import { CompEmits } from "./comp-props";
        const Comp = component$<{}, CompProps>().define(() => null);
        `,
          "not defined in the current file"
        );
      });

      test("argument is not expression", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        const some = {};
        const Comp = component$({}, ...some).define(() => null);
        `,
          'argument is not "Expression"'
        );
      });
    });

    describe("default props", () => {
      test("argument is not provided", () => {
        expectThrows(
          `
        import { component$ } from "vue-tsx-macros";
        const Comp = component$().withDefaults().define(() => null);
        `,
          "argument is not provided"
        );
      });

      test("argument is not expression", () => {
        expectThrows(
          `
          import { component$ } from "vue-tsx-macros";
          const Comp = component$()
            .withDefaults(...[])
            .define(() => null);
        `,
          'argument is not "Expression"'
        );
      });
    });
  });

  describe(USE_RENDER_MACRO, () => {
    const expectThrows = makeExpectThrows(USE_RENDER_MACRO);
    test("is not inside function", () => {
      expectThrows(
        `
      import { useRender$ } from "vue-tsx-macros";
      useRender$(() => <div></div>)
      `,
        'inside "setup"'
      );
    });

    test("is not inside component$", () => {
      expectThrows(
        `
      import { useRender$ } from "vue-tsx-macros";
      const setup = () => {
        useRender$(() => <div></div>)
      }
      `,
        'inside "setup"'
      );
    });

    test("is called empty", () => {
      expectThrows(
        `
      import { component$, useRender$ } from "vue-tsx-macros";
      const Comp = component$().define(() => {
        useRender$()
      })
      `,
        "argument must be provided"
      );
    });

    test("is called with not expression", () => {
      expectThrows(
        `
      import { component$, useRender$ } from "vue-tsx-macros";
      const Comp = component$().define(() => {
        useRender$(...[])
      })
      `,
        'argument must be "Expression"'
      );
    });
  });

  describe(DEFAULT_PROPS_MACRO, () => {
    const expectThrows = makeExpectThrows(DEFAULT_PROPS_MACRO);

    test("is not called", () => {
      expectThrows(
        `
      import { defaultProps$ } from "vue-tsx-macros";
      const defaults = defaultProps$();
      `,
        "must be a called"
      );
    });

    test("is called empty", () => {
      expectThrows(
        `
      import { defaultProps$ } from "vue-tsx-macros";
      const defaults = defaultProps$()();
      `,
        "argument must be provided"
      );
    });

    test("is called with not expression", () => {
      expectThrows(
        `
      import { defaultProps$ } from "vue-tsx-macros";
      const defaults = defaultProps$()(...[]);
      `,
        'argument must be "Expression"'
      );
    });
  });
});

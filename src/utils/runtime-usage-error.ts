export class RuntimeUsageError extends Error {
  constructor({ macro }: { macro: string }) {
    super(`${macro}() macro is called in runtime.
    - Check usage
      - there are certain limitations - https://github.com/madeofsun/vue-tsx-macros#limitations
    - Check your build
      - "vue-tsx-macros/babel-plugin" must be provided to babel - https://github.com/madeofsun/vue-tsx-macros#how-to-use
    `);
  }
}

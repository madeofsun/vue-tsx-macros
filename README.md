# vue-tsx-macros

## Description

Set of marcos for convenient definitions of Vue JSX components.
Enhances developer experience by removing duplication and improving type inference.
Write type-safe components with less extra tooling (like `vue-tsc`/`Volar`).

Includes

- `typescript` types
- `babel` plugin for code transformation

[Usage examples](./examples)

[Sandbox](https://stackblitz.com/edit/vitejs-vite-px3pko?file=README.md)

[Example project](https://github.com/madeofsun/vite-vue-tsx)

### Features

- `component$`

  - infers component `name` from function or variable name
  - infers component `props` similar to `defineProps()` and `withDefaults()` from `vue`
  - infers component `emits` similar to `defineEmits()` from `vue`

- `useRender$`

  - allows to expose instance properties with correct type inference and at the same time use `render` function inside `setup`

- `defaultProps$`

  - adds type assistance for default props definition, in case you want to reuse them outside of `withDefaults()`

### How to use

1. Install

```bash
npm install vue-tsx-macros
```

2. Include babel plugin into your build configuration

- Vite

Add babel plugin to `@vitejs/plugin-vue-jsx` options

```js
import vueJsx from "@vitejs/plugin-vue-jsx";

export default {
  plugins: [
    vueJsx({
      babelPlugins: ["vue-tsx-macros/babel-plugin"],
    }),
  ],
};
```

If you are using `nuxt` with `vite` - use `extendViteConfig`.

- Babel

Add plugin to your babel config alongside `@vue/babel-plugin-jsx`

```js
{
  "plugins": ["@vue/babel-plugin-jsx", "vue-tsx-macros/babel-plugin"]
}
```

3. Use

```tsx
import { ref } from "vue";
import { component$, useRender$ } from "vue-tsx-macros";

export const Example = component$().define((props, { emit }) => {
  const counterRef = ref<InstanceType<typeof Counter>>();

  onMounted(() => {
    const id = setInterval(() => {
      counterRef.value?.increment();
    }, 5000);

    onUnmounted(() => clearInterval(id));
  });

  return () => (
    <div>
      {"A counter"}
      <Counter ref={counterRef} />
    </div>
  );
});

type CounterProps = {
  initial?: number;
};

type CounterEmits = {
  update: (value: number) => void;
};

const Counter = component$<ExampleProps, ExampleEmits>().define(
  (props, { emit }) => {
    const count = ref(props.initial || 0);

    const increment = (value = 1) => {
      count.value += value;
      emit("update", counter.value);
    };

    useRender$(() => (
      <button onClick={() => increment()}>{count.value}</button>
    ));

    return { increment };
  }
);
Counter.inheritAttrs = false;
```

### Transform examples

- Standard component

```tsx
export const Example = component$<{ initialValue?: number }>().define(
  (props) => {
    const counter = ref(props.initialValue || 0);
    const onClick = () => (counter.value += 1);
    return () => <button onClick={onClick}>{counter.value}</button>;
  }
);
```

```jsx
export const Example = {
  name: "Example",
  props: ["initialValue"],
  setup: (props) => {
    const counter = ref(props.initialValue || 0);
    const onClick = () => (counter.value += 1);
    return () => <button onClick={onClick}>{counter.value}</button>;
  },
};
```

- With defaultProps

```tsx
export const Example = component$<{ initialValue?: number }>()
  .withDefaults({ initialValue: 0 })
  .define((props) => {
    const counter = ref(props.initialValue);
    const onClick = () => (counter.value += 1);
    return () => <button onClick={onClick}>{counter.value}</button>;
  });
```

```jsx
const _defaultProps = {
  initialValue: 0,
};
export const Example = {
  name: "Example",
  props: {
    initialValue: {
      type: null,
      default: _defaultProps["initialValue"],
    },
  },
  setup: (props) => {
    const counter = ref(props.initialValue);
    const onClick = () => counter.value + 1;
    return () => <button onClick={onClick}>{counter.value}</button>;
  },
};
```

- With emits

```tsx
type Props = {
  initialValue: number;
};

type Emits = {
  update: (value: number) => void;
};

export const Example = component$<Props, Emits>().define((props, { emit }) => {
  const counter = ref(props.initialValue);
  const onClick = () => {
    counter.value += 1;
    emit("update", counter.value);
  };
  return () => <button onClick={onClick}>{counter.value}</button>;
});
```

```jsx
type Props = {
  initialValue: number,
};
type Emits = {
  update: (value: number) => void,
};
export const Example = {
  name: "Example",
  props: ["initialValue"],
  emits: ["update"],
  setup: (props, { emit }) => {
    const counter = ref(props.initialValue);
    const onClick = () => {
      counter.value += 1;
      emit("update", counter.value);
    };
    return () => <button onClick={onClick}>{counter.value}</button>;
  },
};
```

- Expose properties

```tsx
export const Example = component$().define(() => {
  const counter = ref(0);

  const increment = () => (counter.value += 1);

  useRender$(() => <button onClick={increment}>{counter.value}</button>);

  return { increment };
});
```

```jsx
let _render;
export const Example = {
  name: "Example",
  setup: () => {
    const counter = ref(0);
    const increment = () => (counter.value += 1);
    _render = () => <button onClick={increment}>{counter.value}</button>;
    return {
      increment,
    };
  },
  render() {
    return _render();
  },
};
```

- Functional component

```tsx
export const Example = component$<{ size?: number }>().functional(
  ({ size = 500 }) => {
    return <div data-size={size} />;
  }
);
```

```jsx
export const Example = Object.assign(
  ({ size = 500 }) => {
    return <div data-size={size} />;
  },
  {
    displayName: "Example",
    props: ["size"],
  }
);
```

## Limitations

- In `component$`, type parameters for `props` and `emits` must be `TypeLiteral` or `TypeReference` to `InterfaceDeclaration` or `TypeAliasDeclaration` with `TypeLiteral` in the same file (similar to `defineProps()` from `vue`). Note that only explicitly enumerated properties are included.

```ts
// ok
export const Example = component$<{ size: number }>().define(...)

// ok
export interface ExampleProps {
  size: number
}
export const Example = component$<Props>().define(...)

// ok
export type ExampleProps = {
  size: number
}
export const Example = component$<Props>().define(...)

// compile-time error
import { SomeProps } from './some-file'
export const Example = component$<SomeProps>().define(...)

// compile-time error
export type ExampleProps = { size: number } & { extra: number }
export const Example = component$<ExampleProps>().define(...)
```

- `useRender$` must be used only in `component$().define(` function.

```tsx
// ok
export const Example = component$().define(() => {
  const counter = ref(0);
  const increment = () => (counter.value += 1);

  useRender$(() => <button onClick={increment}>{counter.value}</button>);

  return { increment };
});

// compile-time error
export const Example = component$().define((props) => {
  const counter = ref(0);
  const increment = () => {
    counter.value += 1;

    useRender$(() => <button onClick={increment}>{counter.value}</button>);
  };
  return { increment };
});
```

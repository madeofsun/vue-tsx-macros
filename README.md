# vue-tsx-macros

## Description

Set of marcos for convenient definitions of Vue JSX components.
Enhances developer experience by removing duplication and improving type inference.

Includes

- `typescript` types
- `babel` plugin for code transformation

Usage examples - [test-samples](./src/test-samples)

### Features

- infers component `name` from function or variable name
- infers component `props` similar to `defineProps()` and `withDefaults()` from `vue`
- adds special overload for `expose` from `setup` that allows to it without a loss of correct type inference

### How to use

1. Install package to your project

```bash
npm install vue-tsx-macros
```

1. Include babel plugin into your build configuration

- - Vite

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

If you are using `nuxt` use `extendViteConfig`

- - Babel

Add plugin to your babel config alongside `@vue/babel-plugin-jsx`

```js
{
  "plugins": ["@vue/babel-plugin-jsx", "vue-tsx-macros/babel-plugin"]
}
```

1. Use in your project

```tsx
import { component$ } from "vue-tsx-macros";

export type ExampleProps = {
  initialValue?: number;
};

export const Example = component$<ExampleProps>().define((props) => {
  const counter = ref(props.initialValue || 0);

  return () => <div>{counter.value}</div>;
});
```

### Transform examples

- Standard component

```tsx
export const Example = component$<{ initialValue?: number }>().define(
  (props) => {
    const counter = ref(props.initialValue || 0);
    return () => <div>{counter.value}</div>;
  }
);
```

```jsx
export const Example = {
  name: "Example",
  props: ["initialValue"],
  setup: (props) => {
    const counter = ref(props.initialValue || 0);
    return () => <div>{counter.value}</div>;
  },
};
```

- Standard component with defaultProps

```tsx
export const Example = component$<{ initialValue?: number }>()
  .withDefaults({ initialValue: 0 })
  .define((props) => {
    const counter = ref(props.initialValue);
    return () => <div>{counter.value}</div>;
  });
```

```jsx
const _temp = {
  initialValue: 0,
};
export const Example = {
  name: "Example",
  props: {
    initialValue: {
      type: null,
      default: _temp["initialValue"],
    },
  },
  setup: (props) => {
    const counter = ref(props.initialValue);
    return () => <div>{counter.value}</div>;
  },
};
```

- Standard component with expose and render together

```tsx
export const Example = component$<{ initialValue?: number }>().define(
  (props, { expose }) => {
    const counter = ref(props.initialValue || 0);
    return expose({ counter }, () => <div>{counter.value}</div>);
  }
);
```

```jsx
export const Example = {
  name: "Example",
  props: ["initialValue"],
  setup: (props, { expose }) => {
    const counter = ref(props.initialValue || 0);
    return (
      expose({
        counter,
      }),
      () => <div>{counter.value}</div>
    );
  },
};
```

- Functional component

```tsx
export const Example = component$<{ size: 500 }>().functional(({ size }) => {
  return <div>{size}</div>;
});
```

```jsx
export const Example = Object.assign(
  ({ size }) => {
    return <div>{size}</div>;
  },
  {
    displayName: "Example",
    props: ["size"],
  }
);
```

## Limitations

- Type of `props` must be a `TypeLiteral` or a `TypeReference` to `Interface` or `TypeAlias` in the same file (same limitation as for `defineProps()` from `vue`)

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

// props will be ignored
import { SomeProps } from './some-file'
export const Example = component$<SomeProps>().define(...)
```

- Special overload for `expose` (the one with `render` function) must be used only as `return expose({}, () => ...)`

```tsx
// ok
export const Example = component$().define((_, { expose }) => {
  const counter = ref(0);
  const increment = () => counter.value++;
  return expose({ increment }, () => <div>{counter.value}</div>);
});

// render function will be ignored
export const Example = component$().define((_, context) => {
  const counter = ref(0);
  const increment = () => counter.value++;
  return context.expose({ increment }, () => <div>{counter.value}</div>);
});

// ok
export const Example = component$().define((_, context) => {
  const counter = ref(0);
  const increment = () => counter.value++;
  const expose = context.expose;
  return expose({ increment }, () => <div>{counter.value}</div>);
});

// render function will be ignored
export const Example = component$().define((_, context) =>
  expose({}, () => <div>{counter.value}</div>)
);
```

Copyright (c) 2013-2016, madeofsun (https://github.com/madeofsun)

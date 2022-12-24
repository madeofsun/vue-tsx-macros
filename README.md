# vue-tsx-macros

## Description

Set of marcos for convenient definitions of Vue JSX components.
Enhances developer experience by removing duplication and improving type inference.

Includes

- `typescript` types
- `babel` plugin for code transformation

[Usage examples](./examples)

### Features

- `component$`

  - infers component `name` from function or variable name
  - infers component `props` similar to `defineProps()` and `withDefaults()` from `vue`
  - infers component `emits` similar to `defineEmits()` from `vue`
  - adds special overload for `expose` from `setup` that allows to use it with correct type inference

- `defaultProps$`

  - adds type assistance for default props definition, in case you want to reuse them outside of `withDefaults()`

### How to use

1. Install package to your project

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

If you are using `nuxt` use `extendViteConfig`

- Babel

Add plugin to your babel config alongside `@vue/babel-plugin-jsx`

```js
{
  "plugins": ["@vue/babel-plugin-jsx", "vue-tsx-macros/babel-plugin"]
}
```

3. Use in your code

```tsx
import { component$ } from "vue-tsx-macros";

export type ExampleProps = {
  initialValue?: number;
};

export const Example = component$().define((props) => {
  return () => <div />;
});
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

- Type parameter for `props` or `emits` must be a `TypeLiteral` or a `TypeReference` to `InterfaceDeclaration` or `TypeAliasDeclaration` with `TypeLiteral` in the same file (similar to `defineProps()` from `vue`). Note that only explicitly enumerated properties are included.

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

// props are ignored
import { SomeProps } from './some-file'
export const Example = component$<SomeProps>().define(...)

// props are ignored
export type ExampleProps = { size: number } & { extra: number }
export const Example = component$<ExampleProps>().define(...)
```

- Special overload for `expose` (the one with `render` function) must be used only as `return expose({}, () => ...)`

```tsx
// ok
export const Example = component$().define((_, { expose }) => {
  const counter = ref(0);
  const increment = () => counter.value++;
  return expose({ increment }, () => <div>{counter.value}</div>);
});

// render function is ignored
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

// render function is ignored
export const Example = component$().define((_, context) =>
  expose({}, () => <div>{counter.value}</div>)
);
```

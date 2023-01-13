import * as babel from "@babel/core";

declare global {
  type babel = typeof babel;

  type PluginOptions = {
    /**
     * If false, emits will throw compile-time error
     * @default true
     */
    allowEmits?: boolean;
  };
}

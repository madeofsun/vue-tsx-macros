import { InferDefaults } from "./utils/prop-defaults";

export function $defaultProps<Props>(): <D extends InferDefaults<Props>>(
  props: D
) => D {
  return (props) => props;
}

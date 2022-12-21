import type { InferDefaults } from "./utils/prop-defaults";
import { RuntimeUsageError } from "./utils/runtime-usage-error";

export function defaultProps$<Props>(): <D extends InferDefaults<Props>>(
  props: D
) => D {
  throw new RuntimeUsageError("defaultProps$");
}

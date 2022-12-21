import { RuntimeUsageError } from "utils/runtime-usage-error";
import type { InferDefaults } from "./utils/prop-defaults";

export function defaultProps$<Props>(): <D extends InferDefaults<Props>>(
  props: D
) => D {
  throw new RuntimeUsageError("defaultProps$");
}

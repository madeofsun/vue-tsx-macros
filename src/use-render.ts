import { RuntimeUsageError } from "./utils/runtime-usage-error";
import type { RenderFunction } from "vue";

export const useRender$: (render: RenderFunction) => void = () => {
  throw new RuntimeUsageError({ macro: "useRender$" });
};

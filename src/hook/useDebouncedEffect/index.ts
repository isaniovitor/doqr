import { useEffect } from "react";

export function useDebouncedEffect(
  effect: () => void | (() => void) | Promise<void>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: any[],
  delay: number
) {
  useEffect(() => {
    const handler = setTimeout(() => {
      effect();
    }, delay);

    return () => clearTimeout(handler);
  }, [...deps, delay]);
}

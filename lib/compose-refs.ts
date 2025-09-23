import { useCallback } from "react";

type PossibleRef<T> = React.Ref<T> | undefined;

/**
 * A utility to compose multiple refs together
 * Useful when you need to pass a ref to a component that also needs to use the ref internally
 */
function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref != null) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

/**
 * A custom hook that composes multiple refs into a single ref callback
 */
export function useComposedRefs<T>(...refs: PossibleRef<T>[]) {
  return useCallback((node: T) => {
    refs.forEach((ref) => setRef(ref, node));
  }, refs);
}
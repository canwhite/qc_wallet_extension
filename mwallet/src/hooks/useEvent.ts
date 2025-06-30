import { useRef, useLayoutEffect, useCallback } from "react";

export default function useEvent<T extends (...args: any[]) => any>(
  handler: T
) {
  const handlerRef = useRef<T>(handler);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args: Parameters<T>) => {
    return handlerRef.current(...args);
  }, []);
}

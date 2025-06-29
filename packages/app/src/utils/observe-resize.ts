type ObserveResize = {
  callback: (entity: ResizeObserverEntry) => void;
  dispose: () => void;
};

let _resizeObserver: ResizeObserver | null = null;
const elementsMap = new WeakMap<Element, Array<ObserveResize>>();

// for debugging
if (typeof window !== "undefined") {
  // @ts-expect-error - debugging
  window._resizeObserverElementsMap = elementsMap;
}
/**
 * @internal get or initialize the ResizeObserver instance
 */
const getResizeObserver = () => {
  if (!_resizeObserver) {
    _resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const listeners = elementsMap.get(entry.target) ?? [];
        for (const { callback } of listeners) {
          callback(entry);
        }
      }
    });
  }
  return _resizeObserver;
};

/**
 * @internal remove element's specific listener
 */
const removeListener = (element: Element, listener: ObserveResize) => {
  if (!element) return;
  const listeners = elementsMap.get(element) ?? [];
  const observer = getResizeObserver();
  // remove the listener from the element
  if (listeners.includes(listener)) {
    elementsMap.set(
      element,
      listeners.filter((l) => l !== listener)
    );
  }
  // if no more listeners, unobserve the element
  if (elementsMap.get(element)?.length === 0) {
    observer.unobserve(element);
    elementsMap.delete(element);
  }
};

/**
 * A function to observe the resize of an element use global ResizeObserver.
 *
 * ```ts
 * useEffect(() => {
 *  const dispose1 = observeResize(elRef1.current, (entry) => {});
 *  const dispose2 = observeResize(elRef2.current, (entry) => {});
 *
 *  return () => {
 *   dispose1();
 *   dispose2();
 *  };
 * }, [])
 * ```
 * @return A function to dispose the observer.
 */
export const observeResize = (
  element: Element,
  callback: ObserveResize["callback"]
) => {
  const observer = getResizeObserver();
  if (!elementsMap.has(element)) {
    observer.observe(element);
  }
  const prevListeners = elementsMap.get(element) ?? [];
  const listener = { callback, dispose: () => {} };
  listener.dispose = () => removeListener(element, listener);

  elementsMap.set(element, [...prevListeners, listener]);

  return listener.dispose;
};

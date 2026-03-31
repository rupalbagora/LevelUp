import { useState, useCallback, useRef, useEffect } from "react";

/**
 * usePanelResize
 * Generic horizontal (column) resize hook.
 * Returns: { sizes, startDrag }
 *   sizes  — array of % widths for N panels (always sums to 100)
 *   startDrag(dividerIndex, e) — mousedown handler to start dragging divider i
 */
export function usePanelResize(initialSizes, minPercent = 10) {
  const [sizes, setSizes] = useState(initialSizes);
  const dragging = useRef(null); // { dividerIndex, startX, startSizes }

  const startDrag = useCallback((dividerIndex, e) => {
    e.preventDefault();
    dragging.current = {
      dividerIndex,
      startX: e.clientX,
      startSizes: [...sizes],
    };
  }, [sizes]);

  useEffect(() => {
    function onMouseMove(e) {
      if (!dragging.current) return;
      const { dividerIndex, startX, startSizes } = dragging.current;

      // Total container width
      const container = document.getElementById("battle-arena-grid");
      if (!container) return;
      const totalWidth = container.getBoundingClientRect().width;

      const deltaX = e.clientX - startX;
      const deltaPercent = (deltaX / totalWidth) * 100;

      const newSizes = [...startSizes];
      const left = dividerIndex;     // panel shrinking/growing on the left
      const right = dividerIndex + 1; // panel growing/shrinking on the right

      let newLeft = startSizes[left] + deltaPercent;
      let newRight = startSizes[right] - deltaPercent;

      // Clamp to min size
      if (newLeft < minPercent) {
        newRight -= minPercent - newLeft;
        newLeft = minPercent;
      }
      if (newRight < minPercent) {
        newLeft -= minPercent - newRight;
        newRight = minPercent;
      }

      newSizes[left] = newLeft;
      newSizes[right] = newRight;
      setSizes(newSizes);
    }

    function onMouseUp() {
      dragging.current = null;
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []); // intentionally empty — we read dragging.current by ref

  return { sizes, startDrag, setSizes };
}

/**
 * useVerticalResize
 * Vertical resize for a split panel (e.g. editor / console).
 * Returns: { topPercent, startDrag }
 */
export function useVerticalResize(initialTopPercent = 62, min = 20, max = 85) {
  const [topPercent, setTopPercent] = useState(initialTopPercent);
  const dragging = useRef(null);

  const startDrag = useCallback((e) => {
    e.preventDefault();
    dragging.current = { startY: e.clientY, startTop: topPercent };
  }, [topPercent]);

  useEffect(() => {
    function onMouseMove(e) {
      if (!dragging.current) return;
      const { startY, startTop } = dragging.current;

      const container = document.getElementById("center-panel");
      if (!container) return;
      const totalHeight = container.getBoundingClientRect().height;

      const deltaY = e.clientY - startY;
      const deltaPercent = (deltaY / totalHeight) * 100;
      const clamped = Math.min(max, Math.max(min, startTop + deltaPercent));
      setTopPercent(clamped);
    }

    function onMouseUp() {
      dragging.current = null;
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [min, max]);

  return { topPercent, startDrag };
}

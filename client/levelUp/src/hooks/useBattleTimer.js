import { useState, useEffect, useRef, useCallback } from "react";

/*
  useBattleTimer Hook

  Handles the countdown timer for the coding battle.
*/

export function useBattleTimer(
  initialSeconds = 600,
  { onTick, onExpire, onWarning } = {},
) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  const warningFiredRef = useRef(false);
  const intervalRef = useRef(null);

  const tick = useCallback(() => {
    setSeconds((prev) => {
      const next = prev - 1;

      /* warning at 60 seconds */
      if (next === 60 && !warningFiredRef.current) {
        warningFiredRef.current = true;
        onWarning?.();
      }

      /* timer expired */
      if (next <= 0) {
        setIsRunning(false);
        onExpire?.();
        return 0;
      }

      onTick?.(next);

      return next;
    });
  }, [onTick, onExpire, onWarning]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(tick, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, tick]);

  /* controls */
  const pause = () => setIsRunning(false);

  const resume = () => setIsRunning(true);

  const reset = (newSeconds) => {
    setSeconds(newSeconds ?? initialSeconds);
    warningFiredRef.current = false;
    setIsRunning(true);
  };

  /* format MM:SS */
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return {
    seconds,
    formatted: `${minutes}:${secs}`,
    isWarning: seconds <= 60 && seconds > 0,
    isCritical: seconds <= 30 && seconds > 0,
    isExpired: seconds <= 0,
    isRunning,
    pause,
    resume,
    reset,
  };
}

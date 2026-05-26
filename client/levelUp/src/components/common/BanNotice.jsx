import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { useSelector } from "react-redux";
import { getBanStatusAPI } from "../../services/banService";

const formatRemaining = (milliseconds) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
};

export default function BanNotice() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [banStatus, setBanStatus] = useState(null);
  const [remainingMs, setRemainingMs] = useState(0);
  const serverOffsetMsRef = useRef(0);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let isMounted = true;

    getBanStatusAPI()
      .then((data) => {
        if (isMounted) setBanStatus(data.banned ? data : null);
      })
      .catch(() => {
        if (isMounted) setBanStatus(null);
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!banStatus?.bannedUntil) return;
    serverOffsetMsRef.current = banStatus.serverTime
      ? Date.now() - new Date(banStatus.serverTime).getTime()
      : 0;

    const updateRemaining = () => {
      const currentServerTime = Date.now() - serverOffsetMsRef.current;
      const nextRemainingMs =
        new Date(banStatus.bannedUntil).getTime() - currentServerTime;

      setRemainingMs(Math.max(0, nextRemainingMs));

      if (nextRemainingMs <= 0) {
        setBanStatus(null);
      }
    };

    updateRemaining();
    const intervalId = setInterval(updateRemaining, 1000);

    return () => clearInterval(intervalId);
  }, [banStatus?.bannedUntil, banStatus?.serverTime]);

  if (!isAuthenticated || !banStatus) return null;

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-900 shadow-sm dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-300" />
          <div>
            <p className="text-sm font-black">
              You are banned for 48 hours due to cheating.
            </p>
            <p className="mt-1 text-xs text-red-700 dark:text-red-200/80">
              Battle creation and joining are disabled until the timer ends.
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-red-700 shadow-sm dark:bg-red-950/40 dark:text-red-100">
          <Clock className="h-4 w-4" />
          {formatRemaining(remainingMs)}
        </div>
      </div>
    </div>
  );
}

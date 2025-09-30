import { useState, useEffect, useRef } from "react";

export const useTimer = (duration: number, onTimeout: () => void) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timerId = useRef<number | null>(null);

  useEffect(() => {
    if (timerId.current) {
      clearInterval(timerId.current);
    }

    setTimeLeft(duration);
    if (duration <= 0) {
      return;
    }

    timerId.current = window.setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId.current!);
          onTimeout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
      }
    };
  }, [duration, onTimeout]);

  return { timeLeft };
};

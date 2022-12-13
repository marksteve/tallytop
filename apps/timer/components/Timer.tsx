import parseMs from "parse-ms";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "ui";
import { ArrowCounterClockwise, Play, Stop } from "ui/icons";

type TimerProps = {
  duration: number;
  onSound: (type: string) => void;
  autoStart?: boolean;
};

export default function Timer({ duration, onSound, autoStart }: TimerProps) {
  const { time, start, stop, reset, status } = useTimer(
    duration,
    onSound,
    autoStart
  );
  const { hours, minutes, seconds, milliseconds } = time;
  return (
    <>
      <div className="font-mono text-[15vw]">
        {hours ? `${String(hours).padStart(2, "0")}:` : null}
        {String(
          seconds + milliseconds / 1000 > 59 ? minutes + 1 : minutes
        ).padStart(2, "0")}
        :
        {String(Math.ceil(seconds + milliseconds / 1000) % 60).padStart(2, "0")}
      </div>
      <div className="flex gap-10 text-4xl">
        {status === "running" ? (
          <Button className="bg-orange-200 px-10 py-5" onClick={stop}>
            <Stop />
          </Button>
        ) : (
          <Button className="bg-emerald-200 px-10 py-5" onClick={start}>
            <Play />
          </Button>
        )}
        <Button className="px-10 py-5" onClick={reset}>
          <ArrowCounterClockwise />
        </Button>
      </div>
    </>
  );
}

const defaultBeeps = [
  60, // 0:01:00
  5, // 0:00:05
  4, // 0:00:04
  3, // 0:00:03
  2, // 0:00:02
  1, // 0:00:01
];

const useTimer = (
  duration: number,
  onSound: (type: string) => void,
  autoStart: boolean = false
) => {
  const [time, setTime] = useState(parseMs(duration));
  const beeps = useRef(defaultBeeps);
  const endTime = useRef(Date.now());
  const elapsed = useRef(0);
  const isRunning = useRef(false);
  const [status, setStatus] = useState("reset");

  const stop = useCallback(() => {
    const remaining = endTime.current - Date.now();
    elapsed.current = duration - remaining;
    isRunning.current = false;
    setStatus("stopped");
  }, [duration]);

  const tick = useCallback(() => {
    if (isRunning.current) {
      let remaining = endTime.current - Date.now();
      if (remaining < 0) {
        remaining = 0;
      }
      setTime(parseMs(remaining));
      const second = Math.floor(remaining / 1000) + 1;
      if (beeps.current.includes(second)) {
        beeps.current = beeps.current.filter((v) => v !== second);
        onSound("beep");
      }
      if (remaining === 0) {
        stop();
        onSound("end");
      }
      requestAnimationFrame(tick);
    }
  }, [stop, onSound]);

  const start = useCallback(() => {
    endTime.current = Date.now() + duration - elapsed.current;
    isRunning.current = true;
    setStatus("running");
    if (elapsed.current === 0) {
      onSound("beep");
    }
    requestAnimationFrame(tick);
  }, [duration, onSound, tick]);

  const reset = useCallback(() => {
    setTime(parseMs(duration));
    elapsed.current = 0;
    beeps.current = defaultBeeps;
    isRunning.current = false;
    setStatus("reset");
  }, [duration]);

  useEffect(() => {
    reset();
    if (autoStart) {
      start();
    }
  }, [reset, duration, autoStart, start]);

  return { time, start, stop, reset, status };
};

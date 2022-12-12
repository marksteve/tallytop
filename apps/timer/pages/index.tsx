import Head from "next/head";
import Image from "next/image";
import parseMs from "parse-ms";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "ui";
import { ArrowCounterClockwise, Play, Stop } from "ui/icons";
import logo from "../public/images/logo.svg";

const defaultBeeps = [
  60, // 0:01:00
  5, // 0:00:05
  4, // 0:00:04
  3, // 0:00:03
  2, // 0:00:02
  1, // 0:00:01
];

const useTimer = (duration: number) => {
  const [time, setTime] = useState(parseMs(duration));
  const sound = useRef<any>();
  const beeps = useRef(defaultBeeps);
  const endDate = useRef(new Date());
  const elapsed = useRef(0);
  const isRunning = useRef(false);
  const [status, setStatus] = useState("reset");

  const start = () => {
    endDate.current = new Date(Date.now() + duration - elapsed.current);
    isRunning.current = true;
    setStatus("running");
    if (elapsed.current === 0) {
      sound.current.play("beep");
    }
  };

  const stop = useCallback(() => {
    const remaining = endDate.current.getTime() - Date.now();
    elapsed.current = duration - remaining;
    isRunning.current = false;
    setStatus("stopped");
  }, [duration]);

  const reset = useCallback(() => {
    setTime(parseMs(duration));
    elapsed.current = 0;
    beeps.current = defaultBeeps;
    isRunning.current = false;
    setStatus("reset");
  }, [duration]);

  const tick = useCallback(() => {
    if (isRunning.current) {
      let remaining = endDate.current.getTime() - Date.now();
      if (remaining < 0) {
        remaining = 0;
      }
      setTime(parseMs(remaining));
      const second = Math.floor(remaining / 1000) + 1;
      if (beeps.current.includes(second)) {
        beeps.current = beeps.current.filter((v) => v !== second);
        sound.current.play("beep");
      }
      if (remaining === 0) {
        stop();
        sound.current.play("end");
      }
    }
    requestAnimationFrame(tick);
  }, [stop]);

  useEffect(() => {
    requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    reset();
  }, [reset, duration]);

  useEffect(() => {
    import("@pixi/sound").then(({ sound: pixiSound }) => {
      if (sound.current) {
        // This runs twice for some reason!
        return;
      }
      sound.current = pixiSound;
      sound.current.add("beep", "/sounds/beep.mp3");
      sound.current.add("end", "/sounds/end.mp3");
    });
  }, []);

  return { time, start, stop, reset, status };
};

export default function Timer() {
  const [duration, setDuration] = useState(5 * 60 * 1000);
  const { time, start, stop, reset, status } = useTimer(duration);
  const { hours, minutes, seconds, milliseconds } = time;

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-10">
      <Head>
        <title>Tallytop Timer</title>
        <link rel="icon" href="/images/logo.svg" type="image/svg+xml" />
      </Head>
      <Image src={logo} alt="Tallytop" width={128} />
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
      <div className="flex gap-10 font-mono text-2xl">
        <Button onClick={() => setDuration(5 * 60 * 1000)}>05:00</Button>
        <Button onClick={() => setDuration(4 * 60 * 1000)}>04:00</Button>
        <Button onClick={() => setDuration(2 * 60 * 1000)}>02:00</Button>
        <Button onClick={() => setDuration(15 * 1000)}>00:15</Button>
      </div>
    </div>
  );
}

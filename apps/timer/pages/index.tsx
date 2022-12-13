import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Timer from "../components/Timer";
import logo from "../public/images/logo.svg";

export default function IndexPage() {
  const [queue, setQueue] = useState<(Duration | Group)[]>([
    { name: "Viewing", value: 2 * 1000 },
    {
      durations: [
        { name: "Climb", value: 5 * 1000 },
        { name: "Switch", value: 1000 },
      ],
      repeat: 6,
    },
  ]);
  const [currentDuration, setCurrentDuration] = useState(0);
  const durations = useMemo(() => {
    return queue.reduce<Duration[]>((previousValue, currentValue) => {
      if ((currentValue as Duration)?.value) {
        return [...previousValue, currentValue];
      } else {
        const group = currentValue as Group;
        return [
          ...previousValue,
          ...Array(group.repeat).fill(group.durations).flat(),
        ];
      }
    }, []);
  }, [queue]);

  const sound = useRef<typeof import("@pixi/sound").sound>();

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

  const handleSound = useCallback((alias: string) => {
    if (sound.current) {
      sound.current.play(alias);
    }
  }, []);

  const handleFinish = () =>
    setCurrentDuration((state) => (state + 1) % durations.length);

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-10">
      <Head>
        <title>Tallytop Timer</title>
        <link rel="icon" href="/images/logo.svg" type="image/svg+xml" />
      </Head>
      <Image src={logo} alt="Tallytop" width={128} />
      <Timer
        duration={durations[currentDuration]}
        onSound={handleSound}
        onFinish={handleFinish}
        autoStart={currentDuration > 0}
      />
    </div>
  );
}

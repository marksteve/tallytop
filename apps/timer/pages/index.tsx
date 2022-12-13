import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Timer from "../components/Timer";
import logo from "../public/images/logo.svg";

export default function IndexPage() {
  const [duration, setDuration] = useState(5 * 60 * 1000);
  const sound = useRef<any>();

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

  const handleSound = (type: string) => {
    if (sound.current) {
      sound.current.play(type);
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-10">
      <Head>
        <title>Tallytop Timer</title>
        <link rel="icon" href="/images/logo.svg" type="image/svg+xml" />
      </Head>
      <Image src={logo} alt="Tallytop" width={128} />
      <Timer duration={duration} onSound={handleSound} />
    </div>
  );
}

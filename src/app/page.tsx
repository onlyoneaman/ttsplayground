import type { FC } from "react";
import { TtsDemo } from "@/components/TtsDemo";

const Home: FC = () => {
  return (
    <section className="flex flex-col items-center justify-center w-full h-full">
      {/* <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-center">Coming Soon</h1>
      <p className="text-lg text-muted-foreground max-w-xl text-center mb-8">
        TTS Playground will launch soon. A modern, Text-to-Speech playground experience is on the way!
      </p> */}
      <TtsDemo />
    </section>
  );
};

export default Home;

import type { FC } from "react";
import { TtsDemo } from "@/components/TtsDemo";

const Home: FC = () => {
  return (
    <section className="flex flex-col items-center justify-center w-full h-full">
      <TtsDemo />
    </section>
  );
};

export default Home;

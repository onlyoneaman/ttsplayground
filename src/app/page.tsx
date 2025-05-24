import type { FC } from "react";
import { OpenaiTts } from "@/components/OpenaiTts";

const Home: FC = () => {
  return (
    <section className="flex flex-col items-center justify-center w-full h-full">
      <OpenaiTts />
    </section>
  );
};

export default Home;

import type { FC } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * About Us page for TTS Playground
 * Modern playground for experimenting with Text-to-Speech (TTS) features.
 * Built with Next.js, TypeScript, Tailwind CSS, and Shadcn UI.
 */

const AboutPage: FC = () => {
  return (
    <main className={cn("flex flex-col items-center justify-center min-h-screen bg-background p-6")}> 
      <Card className="max-w-2xl w-full p-8 shadow-lg border bg-card">
        <h1 className="text-3xl font-bold mb-4 text-center">About TTS Playground</h1>
        <p className="mb-4 text-lg text-muted-foreground text-center">
          <b>TTS Playground</b> is your interactive space to experiment with and compare Text-to-Speech (TTS) technology. Instantly convert text into lifelike speech using multiple leading providers—all in one place.
        </p>
        <p className="mb-4 text-base text-muted-foreground text-center">
          {"Whether you're a developer, product designer, educator, or simply curious, TTS Playground lets you:"}
        </p>
        <ul className="mb-4 text-base list-disc list-inside">
          <li>Preview and compare voices from different TTS providers (OpenAI, Cartesia, 11labs, and more).</li>
          <li>Test pronunciation, clarity, and expressiveness for your use case.</li>
          <li>Rapidly prototype and validate TTS integrations for apps, content, or accessibility.</li>
          <li>Understand the strengths and differences of each provider before making decisions.</li>
        </ul>
        <p className="mb-6 text-base text-muted-foreground text-center">
          <b>Supported Providers:</b> OpenAI, Cartesia, 11labs (with more coming soon). Choose your provider, enter your text, and hear the results instantly!
        </p>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Tech Stack</h2>
          <ul className="text-base list-disc list-inside">
            <li><b>Framework:</b> Next.js</li>
            <li><b>Language:</b> TypeScript</li>
            <li><b>Styling:</b> Tailwind CSS</li>
            <li><b>UI Components:</b> Shadcn UI</li>
            <li><b>Linting & Style:</b> Airbnb Style Guide</li>
          </ul>
        </div>
        <div className="text-center text-muted-foreground">
          <a href="https://github.com/onlyoneaman/ttsplayground" className="underline hover:text-primary" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
          <span className="mx-2">|</span>
          <a href="https://ttsplayground.com/" className="underline hover:text-primary" target="_blank" rel="noopener noreferrer">
            Visit Live Site
          </a>
        </div>
      </Card>
    </main>
  );
};

export { AboutPage as default };

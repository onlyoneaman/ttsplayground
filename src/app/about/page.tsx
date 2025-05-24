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
        <h1 className="text-4xl font-extrabold mb-6 text-center text-primary drop-shadow-lg">About TTS Playground</h1>
        <p className="mb-6 text-lg text-center text-muted-foreground">
          <span className="font-semibold">TTS Playground</span> is a modern playground for experimenting with Text-to-Speech (TTS) features. Instantly convert text into lifelike speech in a beautiful, intuitive interface.
        </p>
        <div className="mb-6 flex flex-col items-center gap-4">
          <div className="rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 p-6 w-full max-w-md text-center border border-border shadow-sm">
            <span className="inline-flex items-center gap-2 text-xl font-bold text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              </svg>
              Currently Supported Provider
            </span>
            <div className="mt-2 mb-2">
              <span className="inline-block rounded bg-primary px-3 py-1 text-white font-semibold text-base shadow">OpenAI</span>
            </div>
            <span className="block text-sm text-muted-foreground mt-2">More providers coming soon!</span>
          </div>
          <div className="rounded-xl border border-dashed border-yellow-400 bg-yellow-50 p-4 w-full max-w-md text-center shadow-sm flex flex-col items-center">
            <span className="inline-flex items-center gap-2 text-lg font-semibold text-yellow-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              Coming Soon: ElevenLabs
            </span>
            <span className="mt-1 text-sm text-yellow-600">Support for ElevenLabs voices is on our roadmap!</span>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-center">What can you do?</h2>
          <ul className="text-base list-disc list-inside text-muted-foreground">
            <li>Preview and experiment with OpenAI’s TTS voices.</li>
            <li>Test pronunciation, clarity, and expressiveness for your use case.</li>
            <li>Rapidly prototype and validate TTS integrations for apps, content, or accessibility.</li>
            <li>Stay tuned as we add more providers, voices, and features!</li>
          </ul>
        </div>
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

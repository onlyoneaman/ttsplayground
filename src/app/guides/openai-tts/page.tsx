import type { FC } from "react";
import Link from "next/link";

const OpenaiTtsGuide: FC = () => {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-2xl mx-auto py-10 px-4">
      <header>
        <h1 className="text-3xl font-bold mb-2">OpenAI TTS Guide</h1>
        <p className="text-lg text-muted-foreground mb-8">
          {"Learn how to use OpenAI's Text-to-Speech (TTS) API in your projects. This guide covers authentication, making API calls, and handling audio output."}
        </p>
      </header>
      <section>
        <h2>Getting Started</h2>
        <ol>
          <li>Sign up for an OpenAI account and obtain your API key.</li>
          <li>Install the required SDK or use HTTP requests to access the TTS endpoint.</li>
          <li>Send a text input to the API and receive an audio file response.</li>
          <li>Play or save the returned audio in your application.</li>
        </ol>

        <Link
          className="text-blue-600 hover:underline font-medium"
          href={"https://platform.openai.com/docs/guides/text-to-speech"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="OpenAI TTS Documentation"
        >
          {"OpenAI TTS Documentation"}
        </Link>
      </section>
      <footer className="mt-12">
        <Link href="/guides" className="text-blue-600 hover:underline font-medium">
          ← Back to Guides
        </Link>
      </footer>
    </article>
  );
};

export default OpenaiTtsGuide;

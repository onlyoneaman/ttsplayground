"use client";

import type { FC, FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const PROVIDERS = [
  { label: "OpenAI", value: "openai" },
  { label: "Cartesia", value: "cartesia" },
  { label: "11labs", value: "11labs" },
] as const;

export type TtsDemoProps = {
  readonly className?: string;
};

export type Provider = typeof PROVIDERS[number]["value"];

const TtsDemo: FC<TtsDemoProps> = ({ className }) => {
  const [provider, setProvider] = useState<Provider>("openai");
  const [text, setText] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAudioUrl("");
    try {
      // Replace this fetch with your real API route
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, provider }),
      });
      if (!res.ok) throw new Error("Failed to synthesize speech");
      const data = await res.json();
      setAudioUrl(data.audioUrl);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={cn("w-full max-w-xl mx-auto flex flex-col gap-6 p-6 border rounded-lg bg-card shadow-md", className)}>
      <h2 className="text-2xl font-semibold text-center">Try Text-to-Speech</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1">
          <span className="font-medium">Text</span>
          <Input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter text to synthesize..."
            required
            maxLength={200}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-medium">Provider</span>
          <Select value={provider} onValueChange={v => setProvider(v as Provider)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {PROVIDERS.map(p => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <Button type="submit" disabled={loading || !text} className="w-full">
          {loading ? "Synthesizing..." : "Play"}
        </Button>
      </form>
      {audioUrl && (
        <audio controls src={audioUrl} className="w-full mt-2">
          Your browser does not support the audio element.
        </audio>
      )}
      {error && <div className="text-red-500 text-center">{error}</div>}
    </section>
  );
};

export { TtsDemo };

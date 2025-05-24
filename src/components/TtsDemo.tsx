"use client";

import type { FC, ChangeEvent, FormEvent } from "react";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download, History, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const OPENAI_URL = "https://api.openai.com/v1" as const;
const VOICES = [
  { label: "Alloy", value: "alloy" },
  { label: "Echo", value: "echo" },
  { label: "Fable", value: "fable" },
  { label: "Onyx", value: "onyx" },
  { label: "Nova", value: "nova" },
  { label: "Shimmer", value: "shimmer" },
] as const;
const MODELS = [
  { label: "GPT-4o Mini TTS", value: "gpt-4o-mini-tts" },
  { label: "TTS-1", value: "tts-1" },
  { label: "TTS-1 HD", value: "tts-1-hd" },
] as const;
const PRICES_PER_MILLION: Readonly<Record<string, number>> = {
  "gpt-4o-mini-tts": 12.0,
  "tts-1": 15.0,
  "tts-1-hd": 30.0,
} as const;
const INPUT_PRICES_PER_MILLION: Readonly<Record<string, number>> = {
  "gpt-4o-mini-tts": 0.5,
  "tts-1": 0,
  "tts-1-hd": 0,
} as const;

interface TtsDemoProps {
  readonly className?: string;
}

interface TtsConfig {
  readonly model: string;
  readonly voice: string;
  readonly apiKey: string;
  readonly speed: number;
}

const sha256 = async (source: string): Promise<string> => {
  const sourceBytes = new TextEncoder().encode(source);
  const digest = await crypto.subtle.digest("SHA-256", sourceBytes);
  const resultBytes = [...new Uint8Array(digest)];
  return resultBytes.map((x) => x.toString(16).padStart(2, "0")).join("");
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
  });
};

const base64ToBlob = (base64: string): Blob => {
  const parts = base64.split(";base64,");
  const type = parts[0].split(":")[1];
  const byteCharacters = atob(parts[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type });
};

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const generateCacheKey = async (
  text: string,
  config: TtsConfig,
  type = "audio"
): Promise<string> => {
  return `${type}-${config.model}-${config.voice}-${
    config.speed
  }-${await sha256(text)}`;
};

const splitText = (text: string): string[] => {
  const chunks: string[] = [];
  const maxChunkSize = 4096;
  const delimiters = [". ", "? ", "! ", "\n"];
  let rest = text;
  while (rest.length > 0) {
    if (rest.length <= maxChunkSize) {
      chunks.push(rest);
      break;
    }
    let end = maxChunkSize;
    for (const delimiter of delimiters) {
      const pos = rest.lastIndexOf(delimiter, maxChunkSize);
      if (pos > -1) {
        end = pos + delimiter.length;
        break;
      }
    }
    chunks.push(rest.substring(0, end));
    rest = rest.substring(end);
  }
  return chunks;
};

const fetchAndConcatenateAudio = async (
  textChunks: string[],
  config: TtsConfig,
  progressFn: (progress: number) => void
): Promise<Blob> => {
  const rpm = 100;
  const interval = 60000 / rpm;
  const audioBlobs: Blob[] = [];
  progressFn(0);
  for (let i = 0; i < textChunks.length; i++) {
    progressFn(i / textChunks.length);
    const chunk = textChunks[i];
    const cacheKey = await generateCacheKey(chunk, config, "chunk");
    let cachedBlob: Blob | null = null;
    const cachedBase64 =
      typeof window !== "undefined" ? localStorage.getItem(cacheKey) : null;
    if (cachedBase64) {
      cachedBlob = base64ToBlob(cachedBase64);
      audioBlobs.push(cachedBlob);
      continue;
    }
    if (i > 0 && i % rpm === 0) {
      await delay(60000);
    } else if (i > 0) {
      await delay(interval);
    }
    const response = await fetch(`${OPENAI_URL}/audio/speech`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        input: chunk,
        voice: config.voice,
        speed: config.speed,
      }),
    });
    if (!response.ok) {
      throw new Error(
        `Failed to convert text to speech: ${await response.text()}`
      );
    }
    const blob = await response.blob();
    const base64 = await blobToBase64(blob);
    try {
      if (typeof window !== "undefined") localStorage.setItem(cacheKey, base64);
    } catch (error) {
      // ignore cache errors
    }
    audioBlobs.push(blob);
  }
  progressFn(1);
  return new Blob(audioBlobs, { type: "audio/mp3" });
};

const TtsDemo: FC<TtsDemoProps> = ({ className }) => {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [text, setText] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [model, setModel] = useState<string>(MODELS[1].value);
  const [voice, setVoice] = useState<string>(VOICES[0].value);
  const [apiKey, setApiKey] = useState<string>("");
  const [speed, setSpeed] = useState<number>(1.0);
  const [progress, setProgress] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  // Keyboard handler for textarea: Enter submits, Shift+Enter new line
  const handleTextAreaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Find the form and submit
      const form = e.currentTarget.closest("form");
      if (form) {
        form.requestSubmit();
      }
    }
    // Otherwise allow default (including Shift+Enter)
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedKey = localStorage.getItem("apiKey");
      if (cachedKey) setApiKey(cachedKey);
    }
  }, []);

  useEffect(() => {
    const pricePerMillion = PRICES_PER_MILLION[model] || 0;
    const inputPricePerMillion = INPUT_PRICES_PER_MILLION[model] || 0;
    // Output price: per million chars, Input price: per million chars
    const outputPrice = (text.length / 1_000_000) * pricePerMillion;
    const inputPrice = (text.length / 1_000_000) * inputPricePerMillion;
    setPrice(outputPrice + inputPrice);
  }, [text, model]);

  // Autoplay audio when audioUrl changes
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [audioUrl]);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setText(e.target.value);
  const handleApiKeyChange = (e: ChangeEvent<HTMLInputElement>) =>
    setApiKey(e.target.value);
  const handleModelChange = (v: string) => setModel(v);
  const handleVoiceChange = (v: string) => setVoice(v);
  const handleSpeedChange = (v: number[]) => setSpeed(v[0]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAudioUrl("");
    setProgress(0);
    try {
      if (!apiKey) throw new Error("API key is required");
      const config: TtsConfig = { model, voice, apiKey, speed };
      const cacheKey = await generateCacheKey(text, config);
      const cachedBase64 =
        typeof window !== "undefined" ? localStorage.getItem(cacheKey) : null;
      if (cachedBase64) {
        const cachedBlob = base64ToBlob(cachedBase64);
        setAudioUrl(URL.createObjectURL(cachedBlob));
        setBlob(cachedBlob);
        setProgress(1);
        return;
      }
      const textChunks = splitText(text);
      const audioBlob = await fetchAndConcatenateAudio(
        textChunks,
        config,
        setProgress
      );
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      setBlob(audioBlob);
      try {
        if (typeof window !== "undefined")
          localStorage.setItem(cacheKey, await blobToBase64(audioBlob));
      } catch (error) {
        // ignore cache errors
      }
      if (typeof window !== "undefined") localStorage.setItem("apiKey", apiKey);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <section
      className={cn(
        "w-full h-[80vh] flex flex-row gap-0 rounded-lg border bg-card shadow-lg overflow-hidden",
        className
      )}
    >
      {/* Left Panel: Output & History */}
      <div className="flex flex-col flex-[2] bg-muted h-full p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Text to speech</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" aria-label="History">
              <History className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Clear">
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center border rounded-lg bg-background/70 min-h-[220px]">
          {audioUrl ? (
            <div className="w-full flex flex-col items-center gap-3">
              <audio
                ref={audioRef}
                controls
                src={audioUrl}
                className="w-full"
              />
              <div className="flex gap-2 items-center justify-center">
                <Button asChild variant="outline" size="sm">
                  <a href={audioUrl} download="tts-audio.wav">
                    <Download />
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              {/* <span className="material-symbols-rounded text-4xl mb-2">
                graphic_eq
              </span> */}
              <span className="text-center">
                Generated speech will appear here
              </span>
            </div>
          )}
        </div>
        <form className="mt-6 flex items-center gap-2" onSubmit={handleSubmit}>
          <Textarea
            ref={textAreaRef}
            className="w-full min-h-16 max-h-40 resize-y rounded-lg border border-input bg-background px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:border-primary transition-colors placeholder:text-muted-foreground text-base shadow-xs"
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleTextAreaKeyDown}
            placeholder="Enter your message..."
            aria-label="Text to synthesize"
            maxLength={4096}
            required
            rows={2}
          />
          <Button type="submit" disabled={loading || !text}>
            {loading ? "Generating..." : "Generate"}
          </Button>
        </form>
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
      </div>
      {/* Right Panel: Settings */}
      <div className="flex flex-col flex-1 bg-card border-l p-6 gap-6 min-w-[320px]">
        <div>
          <label className="font-medium mb-1 block">Model</label>
          <Select value={model} onValueChange={handleModelChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {model === "gpt-4o-mini-tts" && (
          <div>
            <label className="font-medium mb-1 block">Instructions</label>
            <Textarea
              className="resize-none"
              placeholder="Speak in an emotive and friendly tone..."
              rows={3}
              // TODO: Hook up to instructions state
            />
          </div>
        )}
        <div>
          <label className="font-medium mb-1 block">Voice</label>
          <Select value={voice} onValueChange={handleVoiceChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              {VOICES.map((v) => (
                <SelectItem key={v.value} value={v.value}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="font-medium mb-1 block">
            Speed <span className="ml-2 font-mono">{speed.toFixed(2)}x</span>
          </label>
          <Slider
            min={0.25}
            max={4.0}
            step={0.05}
            value={[speed]}
            onValueChange={handleSpeedChange}
            className="w-full mt-2"
          />
        </div>
        <div>
          <label className="font-medium mb-1 block">Response format</label>
          <Select value="wav" onValueChange={() => {}}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wav">WAV</SelectItem>
              <SelectItem value="mp3">MP3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Price: ¢{(price * 100).toFixed(2)}
        </div>
        {progress > 0 && progress < 1 && (
          <div className="text-xs text-muted-foreground">
            Progress: {(progress * 100).toFixed(0)}%
          </div>
        )}
        <div className="mt-2">
          <label className="font-medium mb-1 block">API Key</label>
          <Input
            type="password"
            value={apiKey}
            onChange={handleApiKeyChange}
            placeholder="sk-..."
            required
            autoComplete="off"
          />
        </div>
      </div>
    </section>
  );
};

export { TtsDemo };

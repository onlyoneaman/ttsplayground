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
import { VOICES, MODELS, PRICES_PER_MILLION, INPUT_PRICES_PER_MILLION } from "@/constants/openai-constants";
import type { TtsDemoProps, TtsConfig } from "@/types/types";
import { blobToBase64, base64ToBlob, generateCacheKey, splitText, fetchAndConcatenateAudio } from "@/helpers/openai-helpers";

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

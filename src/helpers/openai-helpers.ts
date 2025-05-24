import type { TtsConfig } from "../types/types";
import { OPENAI_URL } from "../constants/openai-constants";

export const sha256 = async (source: string): Promise<string> => {
  const sourceBytes = new TextEncoder().encode(source);
  const digest = await crypto.subtle.digest("SHA-256", sourceBytes);
  const resultBytes = [...new Uint8Array(digest)];
  return resultBytes.map((x) => x.toString(16).padStart(2, "0")).join("");
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
  });
};

export const base64ToBlob = (base64: string): Blob => {
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

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateCacheKey = async (
  text: string,
  config: TtsConfig,
  type = "audio"
): Promise<string> => {
  return `${type}-${config.model}-${config.voice}-${config.speed}-${await sha256(text)}`;
};

export const splitText = (text: string): string[] => {
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

export const fetchAndConcatenateAudio = async (
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

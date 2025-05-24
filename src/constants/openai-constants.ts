export const OPENAI_URL = "https://api.openai.com/v1" as const;

export const VOICES = [
  { label: "Alloy", value: "alloy" },
  { label: "Echo", value: "echo" },
  { label: "Fable", value: "fable" },
  { label: "Onyx", value: "onyx" },
  { label: "Nova", value: "nova" },
  { label: "Shimmer", value: "shimmer" },
] as const;

export const MODELS = [
  { label: "GPT-4o Mini TTS", value: "gpt-4o-mini-tts" },
  { label: "TTS-1", value: "tts-1" },
  { label: "TTS-1 HD", value: "tts-1-hd" },
] as const;

export const PRICES_PER_MILLION: Readonly<Record<string, number>> = {
  "gpt-4o-mini-tts": 12.0,
  "tts-1": 15.0,
  "tts-1-hd": 30.0,
} as const;

export const INPUT_PRICES_PER_MILLION: Readonly<Record<string, number>> = {
  "gpt-4o-mini-tts": 0.5,
  "tts-1": 0,
  "tts-1-hd": 0,
} as const;

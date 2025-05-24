// tts-demo-types.ts
// Types for TtsDemo and related helpers

export interface TtsDemoProps {
  readonly className?: string;
}

export interface TtsConfig {
  readonly model: string;
  readonly voice: string;
  readonly apiKey: string;
  readonly speed: number;
}

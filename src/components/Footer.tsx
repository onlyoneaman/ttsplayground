import type { FC } from "react";
import { cn } from "@/lib/utils";

export type FooterProps = {
  readonly className?: string;
};

const Footer: FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn("w-full border-t border-border bg-background py-4 flex flex-col items-center justify-center text-xs text-muted-foreground gap-1", className)}>
      <span>
        &copy; {new Date().getFullYear()} TTS Playground. All rights reserved.
      </span>
      <span className="inline-flex items-center gap-1">
        Made with <span className="text-red-500" aria-label="love" role="img">❤️</span> by
        <a
          href="https://amankumar.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2 hover:text-primary transition-colors ml-1"
        >
          Aman
        </a>
      </span>
    </footer>
  );
};

export { Footer };


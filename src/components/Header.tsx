import type { FC } from "react";
import { cn } from "@/lib/utils";

export type HeaderProps = {
  readonly className?: string;
};

const Header: FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full border-b border-border bg-background py-6 flex items-center justify-between px-6", className)}>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">TTS Playground</h1>
      <nav>
        <a
          href="/about"
          className="text-sm font-medium underline underline-offset-2 hover:text-primary transition-colors ml-4"
        >
          About
        </a>
      </nav>
    </header>
  );
};

export { Header };

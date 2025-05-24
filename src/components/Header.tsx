import type { FC } from "react";
import { cn } from "@/lib/utils";

export type HeaderProps = {
  readonly className?: string;
};

const Header: FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full border-b border-border bg-background py-6 flex items-center justify-center", className)}>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">TTS Playground</h1>
    </header>
  );
};

export { Header };

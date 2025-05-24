import type { FC } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export type HeaderProps = {
  readonly className?: string;
};

const Header: FC<HeaderProps> = ({ className }) => {
  return (
    <header
      className={cn(
        "w-full border-b border-border bg-background py-6 flex items-center justify-between px-6",
        className
      )}
    >
      <Link href="/">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          TTS Playground
        </h1>
      </Link>
      <nav className="flex items-center gap-4">
        <Link
          href="https://github.com/onlyoneaman/ttsplayground"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Repository"
          className="ml-4"
        >
          <Button variant="ghost" size="icon">
            <Github className="w-5 h-5" />
          </Button>
        </Link>
        <Link
          href="/about"
          className="text-sm font-medium underline underline-offset-2 hover:text-primary transition-colors ml-4"
        >
          About
        </Link>
      </nav>
    </header>
  );
};

export { Header };

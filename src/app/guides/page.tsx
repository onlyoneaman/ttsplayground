import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export type Guide = {
  id: string;
  title: string;
  description: string;
  href: string;
};

const guides: readonly Guide[] = [
  {
    id: "tts-providers",
    title: "TTS Providers",
    description: "Overview of different Text-to-Speech (TTS) providers and their features.",
    href: "/guides/tts-providers",
  },
  {
    id: "openai-tts",
    title: "OpenAI TTS",
    description: "How to use OpenAI's Text-to-Speech (TTS) API in your projects.",
    href: "/guides/openai-tts",
  },
  // {
  //   id: "groq-tts",
  //   title: "Groq TTS",
  //   description: "How to use Groq's Text-to-Speech (TTS) API in your projects.",
  //   href: "/guides/groq-tts",
  // },
];

function GuidesPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Guides</h1>
      <div className="space-y-6">
        {guides.map((guide) => (
          <Card key={guide.id}>
            <CardHeader>
              <CardTitle>{guide.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-gray-600">{guide.description}</p>
              <Link
                href={guide.href}
                className="text-blue-600 hover:underline font-medium"
              >
                Read Guide
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default GuidesPage;

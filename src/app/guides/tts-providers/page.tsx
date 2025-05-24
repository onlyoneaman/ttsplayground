import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export type TtsProvider = {
  id: string;
  name: string;
  description: string;
  guideHref: string;
};

const ttsProviders: readonly TtsProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    description:
      "How to use OpenAI's Text-to-Speech (TTS) API, including models, usage, and integration details.",
    guideHref: "/guides/openai-tts",
  },
  {
    id: "groq",
    name: "Groq",
    description:
      "How to use Groq's TTS API, including supported models, endpoints, and quick start guide.",
    guideHref: "/guides/groq-tts",
  },
];

function TtsProvidersPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">TTS Providers</h1>
      <div className="space-y-6">
        {ttsProviders.map((provider) => (
          <Card key={provider.id}>
            <CardHeader>
              <CardTitle>{provider.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-gray-600">{provider.description}</p>
              <Link
                href={provider.guideHref}
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

export default TtsProvidersPage;

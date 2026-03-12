"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [question, setQuestion] = useState("");
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (question.trim()) {
      router.push(`/chat?question=${encodeURIComponent(question)}`);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Next.js AI Starter
          </h1>
          <a
            href="https://github.com/FradSer/next-ai-starter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="https://img.shields.io/badge/github-%23121011.svg?style=falt&logo=github&logoColor=white"
              alt="GitHub"
              width={64}
              height={20}
            />
          </a>
        </div>
        <p className="text-sm text-muted-foreground">
          Welcome to our chat app, please enter your question.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
        <Input
          type="text"
          value={question}
          placeholder="Say something..."
          onChange={(e) => setQuestion(e.target.value)}
          className="h-11"
        />
        <Button type="submit" disabled={!question.trim()}>
          Start chatting
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </form>

      <footer className="absolute bottom-6 flex items-center gap-1 text-xs text-muted-foreground">
        <span>Made with ❤️ by</span>
        <a
          href="https://www.frad.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:underline"
        >
          Frad
        </a>
      </footer>
    </div>
  );
}

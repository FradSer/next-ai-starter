"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (question.trim()) {
      router.push(`/chat?question=${encodeURIComponent(question)}`);
    }
  };

  return (
    <div className="flex h-screen flex-col items-start justify-center space-y-8">
      <div className="space-y-2">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Next.js AI Starter</h1>
          <Button
            variant="link"
            onClick={() =>
              window.open(
                "https://github.com/FradSer/next-ai-starter",
                "_blank",
              )
            }
          >
            <Image
              src="https://img.shields.io/badge/github-%23121011.svg?style=falt&logo=github&logoColor=white"
              alt="GitHub Badge"
              width={64}
              height={16}
            />
          </Button>
        </div>

        <p className="text-gray-700">
          Welcome to our chat app, please enter your question.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col space-x-0 space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
      >
        <Input
          type="text"
          value={question}
          placeholder="Say something..."
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button
          variant="outline"
          type="submit"
          className="mx-0 w-full sm:max-w-24"
        >
          Submit
        </Button>
      </form>
      <footer className="fixed bottom-4 left-1/2 flex -translate-x-1/2 transform items-center justify-center text-base text-gray-700">
        <p>Made with ❤️ by</p>
        <Button
          variant="link"
          asChild
          className="mx-1.5 w-2 text-base text-gray-700"
        >
          <Link href="https://www.frad.me/" target="_blank">
            Frad
          </Link>
        </Button>
      </footer>
    </div>
  );
}

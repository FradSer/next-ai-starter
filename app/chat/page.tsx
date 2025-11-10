"use client";

import { type Message, useChat } from "ai/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { Input } from "@/components/ui/input";

export default function Chat() {
  const searchParams = useSearchParams();
  const initialSubmitDone = useRef(false);
  const question = searchParams.get("question");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      maxSteps: 5,
      initialInput: question || "",
    });

  useEffect(() => {
    if (question && !initialSubmitDone.current) {
      initialSubmitDone.current = true;
      handleSubmit();
    }
  }, [question, handleSubmit]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleChatSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleSubmit(event);
  };

  return (
    <div className="">
      {messages.map((m: Message) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.toolInvocations ? (
            <pre>{JSON.stringify(m.toolInvocations, null, 2)}</pre>
          ) : (
            <p>{m.content}</p>
          )}
        </div>
      ))}

      <div ref={messagesEndRef} />

      <form
        onSubmit={handleChatSubmit}
        className="fixed bottom-0 left-1/2 mb-8 w-full max-w-md -translate-x-1/2 px-4"
      >
        <Input
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          disabled={isLoading}
          className="w-full"
        />
        <p className="pt-2 text-center text-xs text-gray-700">
          {isLoading
            ? "Working..."
            : "ChatGPT can make mistakes. Check important info."}
        </p>
      </form>
    </div>
  );
}

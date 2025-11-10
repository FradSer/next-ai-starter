"use client";

import { useChat } from "@ai-sdk/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";

function ChatComponent() {
  const searchParams = useSearchParams();
  const initialSubmitDone = useRef(false);
  const question = searchParams.get("question");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [input, setInput] = useState(question || "");
  const { messages, sendMessage, status } = useChat();

  useEffect(() => {
    if (question && !initialSubmitDone.current) {
      initialSubmitDone.current = true;
      sendMessage({ text: question });
    }
  }, [question, sendMessage]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleChatSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="">
      {messages.map((message) => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === "user" ? "User: " : "AI: "}
          {message.parts.map((part, index) => {
            switch (part.type) {
              case "text":
                return <p key={`${message.id}-${index}`}>{part.text}</p>;
              case "tool-weather":
              case "tool-convertFarenheitToCelsius":
                return (
                  <pre key={`${message.id}-${index}`}>
                    {JSON.stringify(part, null, 2)}
                  </pre>
                );
              default:
                return null;
            }
          })}
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
          onChange={(e) => setInput(e.target.value)}
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

export default function Chat() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatComponent />
    </Suspense>
  );
}

"use client";

import { useChat } from "@ai-sdk/react";
import { ArrowLeftIcon, SendIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

function TypingIndicator() {
  return (
    <div className="flex gap-1 px-1">
      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
    </div>
  );
}

function ChatComponent() {
  const searchParams = useSearchParams();
  const initialSubmitDone = useRef(false);
  const question = searchParams.get("question");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const [input, setInput] = useState(question || "");
  const { messages, sendMessage, status } = useChat();

  useEffect(() => {
    if (question && !initialSubmitDone.current) {
      initialSubmitDone.current = true;
      sendMessage({ text: question });
    }
  }, [question, sendMessage]);

  const messagesLengthRef = useRef(messages.length);

  useEffect(() => {
    if (messagesEndRef.current) {
      if (messages.length > messagesLengthRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
      messagesLengthRef.current = messages.length;
    }
  }, [messages]);

  const handleChatSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex shrink-0 items-center gap-2 border-b px-3 py-2.5">
        <Button variant="ghost" size="icon" className="size-8 shrink-0" asChild>
          <Link href="/">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <h1 className="font-semibold">AI Chat</h1>
      </header>

      <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
        <div className="flex flex-col gap-3 pb-4 pt-4">
          {messages.length === 0 && (
            <div className="flex h-[50vh] items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Start a conversation...
              </p>
            </div>
          )}

          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={cn(
                  "flex items-end gap-2",
                  isUser && "flex-row-reverse",
                )}
              >
                {!isUser && (
                  <Avatar className="size-6 shrink-0">
                    <AvatarFallback className="text-[10px]">AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[82%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                    isUser
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted text-foreground",
                  )}
                >
                  {message.parts.map((part, index) => {
                    const partKey = `${message.id}-${part.type}-${index}`;
                    switch (part.type) {
                      case "text":
                        return (
                          <p key={partKey} className="whitespace-pre-wrap">
                            {part.text}
                          </p>
                        );
                      case "tool-weather":
                      case "tool-convertFarenheitToCelsius":
                        return (
                          <pre
                            key={partKey}
                            className="mt-2 overflow-x-auto rounded-lg bg-foreground/10 p-2 text-xs"
                          >
                            {JSON.stringify(part, null, 2)}
                          </pre>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-end gap-2">
              <Avatar className="size-6 shrink-0">
                <AvatarFallback className="text-[10px]">AI</AvatarFallback>
              </Avatar>
              <div className="rounded-2xl rounded-bl-sm bg-muted px-3.5 py-3">
                <TypingIndicator />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <footer className="border-t bg-background px-4 py-3">
        <form onSubmit={handleChatSubmit} className="flex gap-2">
          <Input
            value={input}
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            <SendIcon data-icon="inline-end" />
          </Button>
        </form>
      </footer>
    </div>
  );
}

export default function Chat() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <ChatComponent />
    </Suspense>
  );
}

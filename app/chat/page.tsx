"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Input } from "@/components/ui/input";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolInvocations?: unknown;
};

export default function Chat() {
  const searchParams = useSearchParams();
  const initialSubmitDone = useRef(false);
  const question = searchParams.get("question");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState(question ?? "");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef<ChatMessage[]>([]);

  const setAndStoreMessages = useCallback(
    (next: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
      setMessages((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        messagesRef.current = resolved;
        return resolved;
      });
    },
    [],
  );

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const submitMessage = useCallback(
    async (messageText: string) => {
      const trimmed = messageText.trim();
      if (!trimmed) {
        return;
      }

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
      };

      const updatedMessages = [...messagesRef.current, userMessage];
      messagesRef.current = updatedMessages;
      setMessages(updatedMessages);
      setInput("");
      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: updatedMessages.map(({ role, content }) => ({
              role,
              content,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const assistantText = response.body
          ? await new Response(response.body).text()
          : await response.text();

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: assistantText.trim(),
        };

        setAndStoreMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content:
            error instanceof Error
              ? `Something went wrong: ${error.message}`
              : "Something went wrong.",
        };

        setAndStoreMessages((prev) => [...prev, assistantMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [setAndStoreMessages],
  );

  useEffect(() => {
    if (question && !initialSubmitDone.current) {
      initialSubmitDone.current = true;
      submitMessage(question);
    }
  }, [question, submitMessage]);

  const latestMessageId =
    messages.length > 0 ? messages[messages.length - 1]?.id : undefined;

  useEffect(() => {
    if (!latestMessageId) {
      return;
    }

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [latestMessageId]);

  const handleChatSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitMessage(input);
  };

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInput(event.target.value);
    },
    [],
  );

  const renderedMessages = useMemo(
    () =>
      messages.map((message) => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === "user" ? "User: " : "AI: "}
          {message.toolInvocations ? (
            <pre>{JSON.stringify(message.toolInvocations, null, 2)}</pre>
          ) : (
            <p>{message.content}</p>
          )}
        </div>
      )),
    [messages],
  );

  return (
    <div className="">
      {renderedMessages}

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

"use client";

import { useChat } from "ai/react";
import Markdown from "react-markdown";
import { MoonIcon, SunIcon, SendIcon, SquareIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext";

export function Chatbot() {
  const { theme, toggleTheme } = useTheme();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setInput,
  } = useChat({
    api: "api/chat",
  });

  useEffect( ()=>{
    document.body.classList.toggle("dark", theme==="dark")
  })

  const predefinedQuestions: string[] = [
    "Where should I start with stock market investing?",
    "Give top 50 companies in NFT shares.",
    "Can you suggest the best source to learn deeply about the stock market and investing?",
    "What is the impact of the latest news on the stock market?",
    "How can I start trading stocks and Where?",
  ];

  const handlePredefinedQuestionClick = async (question: string) => {
    setInput(question);
    await handleSubmit(); // This will submit the form immediately after setting the input
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="relative flex flex-col h-full w-full max-w-[800px] mx-auto bg-background rounded-lg shadow-lg">
      {/* Theme Toggle Button */}
      <Button
        onClick={toggleTheme}
        className="absolute top-4 "
        variant="ghost"
      >
        {theme === "light" ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
      </Button>

      {/* Predefined Questions Section */}
      {messages.length === 0 && (
        <div className="bg-muted/50 px-4 py-3 flex flex-col gap-2 sm: m-5 p-10">
          {predefinedQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handlePredefinedQuestionClick(question)}
              className="w-full"
            >
              {question}
            </Button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-auto p-6">
        {messages.length === 0 && (
          <div className="flex flex-col justify-center items-center h-full">
            <Image src="/ai.png" alt="AI" width={80} height={80} />
            <p className="text-lg text-muted-foreground mt-4">
              Welcome to the Stock Market Advisor Chatbot! Ask me anything
              related to the stock market.
            </p>
          </div>
        )}
        <div className="flex flex-col gap-4">
          {messages.map((message) =>
            message.role === "assistant" ? (
              <div key={message.id} className="flex items-start gap-3">
                <div className="p-2 border border-gray-700 rounded-full">
                  <Image src="/ai.png" alt="AI" width={20} height={20} />
                </div>
                <div className="bg-muted rounded-lg p-3 max-w-[70%]">
                  <Markdown className="text-sm text-muted-foreground">
                    {message.content}
                  </Markdown>
                </div>
              </div>
            ) : (
              <div key={message.id} className="flex justify-end">
                <div className="bg-primary rounded-lg p-3 max-w-[70%]">
                  <p className="text-sm text-primary-foreground">
                    {message.content}
                  </p>
                </div>
              </div>
            )
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-muted/50 px-4 py-3 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Textarea
            placeholder="Type your message..."
            className="rounded-lg pr-12 min-h-[64px]"
            rows={1}
            value={input}
            onChange={handleInputChange}
          />

          {!isLoading ? (
            <Button
              type="submit"
              size="icon"
              disabled={!input || isLoading}
              className="absolute bottom-3 right-3 rounded-full"
            >
              <SendIcon className="w-5 h-5" />
              <span className="sr-only">Send</span>
            </Button>
          ) : (
            <Button
              type="button"
              size="icon"
              disabled={!isLoading}
              onClick={stop}
              className="absolute bottom-3 right-3 rounded-full"
            >
              <SquareIcon className="w-5 h-5" fill="white" />
              <span className="sr-only">Stop</span>
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

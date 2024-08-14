"use client";

import { ThemeProvider } from "@/components/component/ThemeContext";
import { Chatbot } from "@/components/component/chatbot";

export default function Home() {
  return (
    <ThemeProvider>
      <main className="flex items-center justify-center h-screen w-full bg-gray-50">
        <Chatbot />
      </main>
    </ThemeProvider>
  );
}

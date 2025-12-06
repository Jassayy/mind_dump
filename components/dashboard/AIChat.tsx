"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Bot, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Message {
     role: "user" | "ai";
     content: string;
}

export default function AIChat() {
     const [messages, setMessages] = useState<Message[]>([]);
     const [input, setInput] = useState("");
     const [isLoading, setIsLoading] = useState(false);
     const messagesEndRef = useRef<HTMLDivElement>(null);

     const scrollToBottom = () => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
     };

     useEffect(() => {
          scrollToBottom();
     }, [messages]);

     const sendMessage = async () => {
          if (!input.trim() || isLoading) return;

          const userMessage = input.trim();
          setInput("");
          setIsLoading(true);

          // Add user message immediately
          setMessages((prev) => [
               ...prev,
               { role: "user", content: userMessage },
          ]);

          try {
               const res = await fetch("/api/ai/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: userMessage }),
                    credentials: "include",
               });

               if (!res.body) {
                    setIsLoading(false);
                    return;
               }

               const reader = res.body.getReader();
               const decoder = new TextDecoder();
               let aiReply = "";

               // Add empty AI message placeholder
               setMessages((prev) => [...prev, { role: "ai", content: "" }]);

               while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    aiReply += chunk;

                    // Update last AI message in streaming mode
                    setMessages((prev) => {
                         const updated = [...prev];
                         updated[updated.length - 1] = {
                              role: "ai",
                              content: aiReply,
                         };
                         return updated;
                    });
               }
          } catch (error) {
               console.error("Error sending message:", error);
               setMessages((prev) => {
                    const updated = [...prev];
                    if (
                         updated[updated.length - 1]?.role === "ai" &&
                         !updated[updated.length - 1].content
                    ) {
                         updated[updated.length - 1] = {
                              role: "ai",
                              content: "Sorry, I encountered an error. Please try again.",
                         };
                    }
                    return updated;
               });
          } finally {
               setIsLoading(false);
          }
     };

     const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter" && !e.shiftKey) {
               e.preventDefault();
               sendMessage();
          }
     };

     return (
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col h-[500px]">
               {/* Header */}
               <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                         <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                         Chat with Mr.Dumpster
                    </h3>
               </div>

               {/* Messages Container */}
               <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-950/50">
                    {messages.length === 0 ? (
                         <div className="flex items-center justify-center h-full text-center">
                              <div className="text-zinc-500 dark:text-zinc-400">
                                   <Bot className="h-12 w-12 mx-auto mb-3 text-zinc-400" />
                                   <p className="text-sm">
                                        Start a conversation with your AI
                                        assistant
                                   </p>
                              </div>
                         </div>
                    ) : (
                         messages.map((message, idx) => (
                              <div
                                   key={idx}
                                   className={`flex gap-3 ${
                                        message.role === "user"
                                             ? "justify-end"
                                             : "justify-start"
                                   }`}
                              >
                                   {message.role === "ai" && (
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                             <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                   )}
                                   <div
                                        className={`max-w-[75%] rounded-lg px-4 py-2 ${
                                             message.role === "user"
                                                  ? "bg-blue-600 text-white rounded-br-sm"
                                                  : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm border border-zinc-200 dark:border-zinc-700"
                                        }`}
                                   >
                                        <p className="text-sm whitespace-pre-wrap wrap-break-word">
                                             {message.content}
                                             {idx === messages.length - 1 &&
                                                  isLoading &&
                                                  message.role === "ai" && (
                                                       <span className="inline-block w-2 h-4 ml-1 bg-zinc-400 animate-pulse" />
                                                  )}
                                        </p>
                                   </div>
                                   {message.role === "user" && (
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                                             <UserIcon className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
                                        </div>
                                   )}
                              </div>
                         ))
                    )}
                    <div ref={messagesEndRef} />
               </div>

               {/* Input Area */}
               <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <div className="flex gap-2">
                         <Input
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder="Type your message..."
                              disabled={isLoading}
                              className="flex-1"
                         />
                         <Button
                              onClick={sendMessage}
                              disabled={isLoading || !input.trim()}
                              size="icon"
                              className="shrink-0"
                         >
                              <Send className="h-4 w-4" />
                         </Button>
                    </div>
               </div>
          </div>
     );
}

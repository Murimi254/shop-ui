import { useProductChatMutation } from "@/api/exclusive";
import { getApiErrorMessage } from "@/utils/api-error";
import { cn } from "@/utils/utility-functions";
import { Bot, MessageCircle, Send, User, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

const STARTER_MESSAGES: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Hi. Ask me about product availability, prices, categories, or stock.",
  },
];

export function ProductChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(STARTER_MESSAGES);
  const [productChat, productChatState] = useProductChatMutation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, messages, productChatState.isLoading]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const message = input.trim();
    if (!message || productChatState.isLoading) return;

    setInput("");
    setMessages(current => [...current, createMessage("user", message)]);

    try {
      const response = await productChat({ message }).unwrap();
      setMessages(current => [...current, createMessage("assistant", response.reply)]);
    } catch (error) {
      setMessages(current => [
        ...current,
        createMessage("assistant", getApiErrorMessage(error, "I could not answer that product question right now.")),
      ]);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section className="flex h-[min(560px,calc(100vh-7rem))] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-2xl">
          <header className="flex items-center justify-between border-b border-gray-100 bg-black px-4 py-3 text-white">
            <div className="flex min-w-0 items-center gap-2">
              <Bot className="h-5 w-5 shrink-0" />
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold">Product Assistant</h2>
                <p className="truncate text-xs text-white/70">Catalog answers</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close product assistant"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-4 py-4">
            {messages.map(message => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {productChatState.isLoading && (
              <div className="flex items-start gap-2">
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500">Checking the catalog...</div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-gray-100 bg-white p-3">
            <input
              value={input}
              onChange={event => setInput(event.target.value)}
              maxLength={500}
              placeholder="Ask about products"
              className="min-w-0 flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] focus:border-black focus:ring-2 focus:ring-black/10"
            />
            <button
              type="submit"
              disabled={!input.trim() || productChatState.isLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#db4444] text-white transition-colors hover:bg-[#c93636] disabled:pointer-events-none disabled:opacity-50"
              aria-label="Send product question"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(current => !current)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#db4444] text-white shadow-xl transition-colors hover:bg-[#c93636] focus:outline-none focus:ring-4 focus:ring-[#db4444]/20"
        aria-label={isOpen ? "Close product assistant" : "Open product assistant"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const Icon = isUser ? User : Bot;

  return (
    <div className={cn("flex items-start gap-2", isUser && "justify-end")}>
      {!isUser && (
        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white">
          <Icon className="h-4 w-4" />
        </div>
      )}
      <p
        className={cn(
          "max-w-[82%] whitespace-pre-wrap break-words rounded-md px-3 py-2 text-sm leading-6",
          isUser ? "bg-[#db4444] text-white" : "border border-gray-200 bg-white text-gray-800",
        )}
      >
        {message.content}
      </p>
      {isUser && (
        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700">
          <Icon className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
  };
}

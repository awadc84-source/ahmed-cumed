import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, BrainCircuit, Bot, User, RefreshCw } from "lucide-react";
import { sendAIChatMessage } from "../services/api";

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSymbol: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  activeSymbol,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "ai",
      text: `Hello Ahmed! I'm Apex AI, your Windows 11 desktop trading co-pilot. How can I assist with your ${activeSymbol} technical analysis or risk parameters today?`,
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const replyText = await sendAIChatMessage(userMsg.text, { symbol: activeSymbol });
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-[#090d16] border-l border-[#21262d] shadow-2xl z-50 flex flex-col justify-between animate-in slide-in-from-right duration-200 text-slate-200">
      {/* Header */}
      <div className="p-3 bg-[#0d1117] border-b border-[#21262d] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-1">
              <span>Apex AI Assistant</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </h3>
            <p className="text-[10px] text-slate-400">Powered by Gemini 3.6 Flash</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-[#161b22] text-slate-400 hover:text-slate-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 font-sans text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-2 ${
              m.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                m.sender === "user"
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-cyan-500/20 border border-cyan-500/40 text-cyan-400"
              }`}
            >
              {m.sender === "user" ? "A" : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                m.sender === "user"
                  ? "bg-amber-500/20 border border-amber-500/30 text-amber-100 rounded-tr-none"
                  : "bg-[#161b22] border border-[#30363d] text-slate-200 rounded-tl-none whitespace-pre-line"
              }`}
            >
              <p>{m.text}</p>
              <span className="text-[9px] text-slate-400 block mt-1 text-right font-mono">
                {m.time}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-cyan-400 text-xs py-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing chart patterns & order flow...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-[#0d1117] border-t border-[#21262d] flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${activeSymbol} or risk management...`}
          className="flex-1 bg-[#161b22] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

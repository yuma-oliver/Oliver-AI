import { useState, useRef, useEffect } from "react";
import Anthropic from "@anthropic-ai/sdk";
import { MODEL } from "@oliver/claude";
import { fetchTasks } from "../lib/supabase";

const ANTHROPIC_API_KEY = (import.meta as unknown as { env: Record<string, string> }).env.VITE_ANTHROPIC_API_KEY ?? "";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const tasks = await fetchTasks().catch(() => []);
      const pendingTasks = tasks.filter((t) => t.status === "pending").slice(0, 10);

      const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY, dangerouslyAllowBrowser: true });
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 1024,
        system: `あなたはOliver社の社内向けAI秘書「Oliver AI」です。
現在の未対応タスク一覧: ${JSON.stringify(pendingTasks)}
ユーザーの質問や依頼に対して、タスク情報を踏まえて簡潔に回答してください。`,
        messages: [
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: "user" as const, content: userMsg },
        ],
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "";
      setMessages((prev) => [...prev, { role: "assistant", content: text }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: `エラー: ${e instanceof Error ? e.message : "応答に失敗しました"}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <header className="h-14 flex items-center px-6 bg-white border-b border-neutral-200 shrink-0">
        <h1 className="text-base font-semibold text-neutral-900">AIチャット</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm font-medium">Oliver AIに何でも聞いてください</p>
            <p className="text-xs mt-1">タスクの整理や優先度の判断をお手伝いします</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === "user"
                ? "bg-indigo-600 text-white rounded-br-sm"
                : "bg-white border border-neutral-200 text-neutral-800 rounded-bl-sm"
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-neutral-200 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white border-t border-neutral-200 shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="メッセージを入力... (Enter で送信)"
            className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="rounded-xl bg-indigo-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
}

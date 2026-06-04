import { useState, useEffect, useCallback } from "react";
import { fetchTasks, updateTaskStatus, type Task } from "../lib/supabase";
import { syncTeamsMentions, type SyncResult } from "../lib/syncService";
import { useAuth } from "../contexts/AuthContext";

type FilterKey = "pending" | "in_progress" | "done" | "all";

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: "pending", label: "未対応" },
  { key: "in_progress", label: "対応中" },
  { key: "done", label: "完了" },
  { key: "all", label: "全て" },
];

const priorityConfig = {
  high: { label: "高", className: "bg-red-100 text-red-700 border-red-200" },
  medium: { label: "中", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  low: { label: "低", className: "bg-green-100 text-green-700 border-green-200" },
} as const;

export default function TaskView() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterKey>("pending");
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "タスクの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleSync() {
    if (!user) {
      setSyncMessage("先にMicrosoftアカウントでログインしてください");
      return;
    }
    setSyncing(true);
    setSyncMessage(null);
    try {
      const result: SyncResult = await syncTeamsMentions();
      setSyncMessage(
        `完了: 取得 ${result.fetched}件 → 登録 ${result.registered}件 / スキップ ${result.skipped}件`
      );
      setLastSync(new Date().toLocaleString("ja-JP"));
      await loadTasks();
    } catch (e) {
      setSyncMessage(`エラー: ${e instanceof Error ? e.message : "同期に失敗しました"}`);
    } finally {
      setSyncing(false);
    }
  }

  async function handleStatusChange(id: string, status: Task["status"]) {
    await updateTaskStatus(id, status);
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
  const countFor = (key: FilterKey) => key === "all" ? tasks.length : tasks.filter((t) => t.status === key).length;

  return (
    <div className="flex flex-col h-full">
      <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-neutral-200 shrink-0">
        <div>
          <h1 className="text-base font-semibold text-neutral-900">タスク一覧</h1>
          {lastSync && <p className="text-xs text-neutral-400">最終同期: {lastSync}</p>}
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white text-sm font-medium px-4 py-2 hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          <svg className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {syncing ? "同期中..." : "タスクを同期"}
        </button>
      </header>

      {syncMessage && (
        <div className={`px-6 py-2 text-xs ${syncMessage.startsWith("エラー") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          {syncMessage}
        </div>
      )}

      <div className="flex items-center gap-1 px-6 py-3 bg-white border-b border-neutral-200 shrink-0">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === tab.key ? "bg-indigo-50 text-indigo-700" : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            {tab.label}
            <span className={`text-xs rounded-full px-1.5 py-0.5 ${filter === tab.key ? "bg-indigo-100 text-indigo-600" : "bg-neutral-100 text-neutral-500"}`}>
              {countFor(tab.key)}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-neutral-400">
            <svg className="w-6 h-6 animate-spin mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            読み込み中...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-500">
            <p className="text-sm">{error}</p>
            <button onClick={loadTasks} className="mt-2 text-xs text-indigo-600 underline">再試行</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
            <svg className="w-12 h-12 mb-4 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">タスクはありません</p>
          </div>
        ) : (
          filtered.map((task) => (
            <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
          ))
        )}
      </div>
    </div>
  );
}

function TaskCard({ task, onStatusChange }: { task: Task; onStatusChange: (id: string, status: Task["status"]) => void }) {
  const priority = priorityConfig[task.priority ?? "medium"];

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 hover:border-indigo-200 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-medium text-neutral-900 leading-snug flex-1">{task.title}</h3>
        <span className={`shrink-0 inline-flex items-center text-xs font-semibold rounded-full border px-2.5 py-0.5 ${priority.className}`}>
          優先度: {priority.label}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-neutral-400 mb-3 flex-wrap">
        {task.requested_by && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {task.requested_by}
          </span>
        )}
        {task.source_channel && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            {task.source_channel}
          </span>
        )}
        {task.received_at && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {new Date(task.received_at).toLocaleString("ja-JP")}
          </span>
        )}
      </div>

      {task.ai_summary && (
        <div className="bg-indigo-50 rounded-lg px-3 py-2 mb-3">
          <p className="text-xs text-indigo-700">
            <span className="font-medium">AI判定理由: </span>{task.ai_summary}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        {task.source_message_url && (
          <a
            href={task.source_message_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Teamsで開く
          </a>
        )}
        <div className="ml-auto flex items-center gap-2">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as Task["status"])}
            className="text-xs border border-neutral-200 rounded px-2 py-1 text-neutral-600 bg-white"
          >
            <option value="pending">未対応</option>
            <option value="in_progress">対応中</option>
            <option value="done">完了</option>
          </select>
        </div>
      </div>
    </div>
  );
}

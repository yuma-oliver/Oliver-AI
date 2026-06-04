import { getAccessToken, getTeamsMentions } from "@oliver/graph";
import { filterMentions } from "@oliver/claude";
import { upsertTasks, type Task } from "./supabase";

const ANTHROPIC_API_KEY = (import.meta as unknown as { env: Record<string, string> }).env.VITE_ANTHROPIC_API_KEY ?? "";

export interface SyncResult {
  fetched: number;
  registered: number;
  skipped: number;
}

export async function syncTeamsMentions(): Promise<SyncResult> {
  const token = await getAccessToken();

  const mentions = await getTeamsMentions(token);
  if (mentions.length === 0) return { fetched: 0, registered: 0, skipped: 0 };

  const judgments = await filterMentions(mentions, ANTHROPIC_API_KEY);

  const toRegister = judgments.filter((j) => j.action_required);
  const skipped = judgments.length - toRegister.length;

  if (toRegister.length > 0) {
    const tasks: Omit<Task, "id">[] = toRegister.map((j) => {
      const rawContent = j.mention.body?.content?.replace(/<[^>]*>/g, "") ?? "";
      const title = rawContent.length > 60 ? rawContent.slice(0, 59) + "…" : rawContent;
      const hasUrgency = /至急|重要|ASAP/i.test(rawContent);

      return {
        title,
        original_content: rawContent,
        ai_summary: j.reason,
        status: "pending",
        priority: hasUrgency ? "high" : j.priority,
        requested_by: j.mention.from?.user?.displayName ?? null,
        source_platform: "teams",
        source_channel: j.mention.channelIdentity?.channelId ?? j.mention.chatId ?? null,
        source_message_url: j.mention.webUrl ?? null,
        received_at: j.mention.createdDateTime ?? null,
        external_id: j.mention.webUrl ?? j.mention.id,
      };
    });

    await upsertTasks(tasks);
  }

  return { fetched: mentions.length, registered: toRegister.length, skipped };
}

let syncInterval: ReturnType<typeof setInterval> | null = null;

export function startAutoSync(onResult?: (r: SyncResult) => void): void {
  if (syncInterval) return;
  syncInterval = setInterval(async () => {
    try {
      const result = await syncTeamsMentions();
      onResult?.(result);
    } catch (e) {
      console.error("Auto sync failed", e);
    }
  }, 5 * 60 * 1000); // 5 minutes
}

export function stopAutoSync(): void {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
}

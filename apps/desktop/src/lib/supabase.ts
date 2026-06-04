import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as unknown as { env: Record<string, string> }).env.VITE_SUPABASE_URL ?? "https://rqtwnqumpqenmnaluihx.supabase.co";
const supabaseKey = (import.meta as unknown as { env: Record<string, string> }).env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable__hN62gke1zpbYFs1ru7Stw_dbpZsApC";

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Task {
  id: string;
  title: string;
  original_content: string | null;
  ai_summary: string | null;
  status: "pending" | "in_progress" | "done";
  priority: "high" | "medium" | "low";
  requested_by: string | null;
  source_platform: string | null;
  source_channel: string | null;
  source_message_url: string | null;
  received_at: string | null;
  external_id: string | null;
}

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("received_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Task[];
}

export async function upsertTasks(tasks: Omit<Task, "id">[]): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .upsert(tasks, { onConflict: "external_id", ignoreDuplicates: true });

  if (error) throw error;
}

export async function updateTaskStatus(id: string, status: Task["status"]): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
}

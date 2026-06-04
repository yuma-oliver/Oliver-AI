import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-opus-4-6";

// Teams mention structure from Graph API
export interface TeamsMention {
  id: string;
  body: { content: string; contentType: string };
  from: { user: { displayName: string; userPrincipalName: string } };
  createdDateTime: string;
  webUrl: string;
  channelIdentity?: { channelId: string; teamId: string };
  chatId?: string;
}

export interface MentionJudgment {
  mention: TeamsMention;
  action_required: boolean;
  priority: "high" | "medium";
  reason: string;
}

const FILTER_SYSTEM_PROMPT = `あなたは社内向けAI秘書です。
Teamsのメンションを受け取り、要対応かどうかを判断してください。

要対応の基準：
- 依頼・確認・承認を求める文言がある
- 質問形式で返答を求めている
- 締め切り・期限が含まれる
- 「至急」「重要」などの緊急フラグがある

スキップの基準：
- FYI・情報共有のみ
- 挨拶・感謝・スタンプ反応
- 自分が送信したメッセージ
- 自動通知・ボット

必ずJSON形式で回答してください。`;

export async function filterMentions(
  mentions: TeamsMention[],
  apiKey: string,
  currentUserDisplayName = "谷岡佑馬"
): Promise<MentionJudgment[]> {
  if (mentions.length === 0) return [];

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const results: MentionJudgment[] = [];

  for (const mention of mentions) {
    // Skip own messages
    if (mention.from?.user?.displayName === currentUserDisplayName) {
      results.push({ mention, action_required: false, priority: "medium", reason: "自分が送信したメッセージ" });
      continue;
    }

    const content = mention.body?.content?.replace(/<[^>]*>/g, "") ?? "";

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 256,
      system: FILTER_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `以下のTeamsメンションを判定してください:\n\n送信者: ${mention.from?.user?.displayName}\n内容: ${content}\n\nJSON形式で回答: {"action_required": true/false, "priority": "high"/"medium", "reason": "判定理由（1行）"}`,
        },
      ],
    });

    try {
      const text = response.content[0].type === "text" ? response.content[0].text : "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        results.push({
          mention,
          action_required: Boolean(parsed.action_required),
          priority: parsed.priority === "high" ? "high" : "medium",
          reason: String(parsed.reason ?? ""),
        });
      } else {
        results.push({ mention, action_required: false, priority: "medium", reason: "判定エラー" });
      }
    } catch {
      results.push({ mention, action_required: false, priority: "medium", reason: "パースエラー" });
    }
  }

  return results;
}

export async function generateBriefing(
  tasks: unknown[],
  calendar: unknown[],
  emails: unknown[],
  apiKey: string
): Promise<string> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `以下の情報をもとに、今日の業務開始前ブリーフィングを日本語で作成してください。

今日の予定: ${JSON.stringify(calendar)}
未読メール: ${JSON.stringify(emails)}
未対応タスク: ${JSON.stringify(tasks)}

出力形式:
- 今日の予定（件数と概要）
- 要返信メール（件数と差出人・件名）
- 積み残しタスク（件数と優先度高のもの）
- 今日やるべきこと TOP 3（AIの判断）`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
      </svg>
    ),
    title: "Teamsメンション自動フィルタリング",
    description:
      "Claude AIがTeamsの全メンションを解析し、本当に対応が必要なものとノイズを自動分類。重要度に応じて優先度を付け、見落としをゼロに。",
    badge: "AI分析",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "朝のブリーフィング（メール要約＋今日の予定）",
    description:
      "毎朝指定時刻に、未読メールの要約・今日の会議予定・対応待ちタスクをまとめてデスクトップ通知。1日のスタートをスムーズに。",
    badge: "自動化",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "AIによるタスク自動生成",
    description:
      "メンションやメールの内容からClaudeが自動でタスクを生成・整理。期限・担当者・優先度まで推定し、Supabaseに保存してチームで共有。",
    badge: "Claude API",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-600 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            主な機能
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            業務効率を根本から変える3つの機能
          </h2>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            Microsoft TeamsとOutlookに連携し、AIが自動で重要な情報を抽出・整理します。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative bg-white border border-neutral-200 rounded-2xl p-8 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  {feature.icon}
                </div>
                <span className="text-xs font-medium bg-neutral-100 text-neutral-600 rounded-full px-3 py-1">
                  {feature.badge}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3 leading-snug">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

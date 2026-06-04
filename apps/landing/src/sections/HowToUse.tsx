const steps = [
  {
    number: "01",
    title: "Azure ADログイン",
    description:
      "会社のMicrosoftアカウントでAzure ADにサインイン。一度認証すれば、以降は自動でTeams・Outlook・カレンダーに安全にアクセスします。",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "バックグラウンド監視",
    description:
      "アプリを起動したままにするだけ。設定した間隔でTeamsメンションとメールを自動取得し、Claude AIがリアルタイムで重要度を分析します。",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "要対応メンションのみ通知",
    description:
      "AIが「対応必要」と判断したメンションのみデスクトップ通知。通知をクリックすればタスク詳細とAIの判定理由を即確認できます。",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
];

export default function HowToUse() {
  return (
    <section id="how-to-use" className="py-24 bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white border border-neutral-200 text-neutral-600 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            使い方
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            3ステップで使い始められる
          </h2>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            難しいセットアップは不要。インストールしてMicrosoftアカウントでログインするだけです。
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-white border-2 border-indigo-200 rounded-full flex items-center justify-center shadow-md shadow-indigo-100">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="text-xs font-mono font-bold text-indigo-400 mb-2">{step.number}</div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">{step.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

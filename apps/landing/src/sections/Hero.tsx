export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white py-24 md:py-36">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-50 rounded-full opacity-60 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-indigo-500 rounded-full" />
          Claude API搭載 · 社内向けAI秘書
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-neutral-900 leading-tight tracking-tight mb-6">
          Teamsのメンションを、
          <br />
          <span className="text-indigo-600">やるべきことだけに。</span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Claude APIを使った社内向けAI秘書。大量のTeamsメンションを自動分析し、
          本当に対応が必要なものだけを通知。朝のメール要約から今日の予定まで、
          業務効率を根本から変えます。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#download"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 text-white font-semibold px-8 py-4 text-base hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Windows版をダウンロード
          </a>
          <a
            href="#download"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white text-neutral-700 font-semibold px-8 py-4 text-base hover:bg-neutral-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            macOS版をダウンロード
          </a>
        </div>

        <p className="mt-6 text-sm text-neutral-400">
          無料で利用開始 · Windows 10以降 / macOS 12以降対応
        </p>

        {/* App screenshot mockup */}
        <div className="mt-16 relative mx-auto max-w-4xl">
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-2xl shadow-neutral-200 overflow-hidden">
            <div className="bg-neutral-100 border-b border-neutral-200 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 ml-4">
                <div className="bg-white rounded-md px-3 py-1 text-xs text-neutral-400 text-center max-w-xs mx-auto">
                  Oliver AI
                </div>
              </div>
            </div>
            <div className="bg-neutral-50 p-8">
              <div className="flex gap-4 items-start">
                <div className="w-48 bg-white rounded-xl border border-neutral-200 p-4 shrink-0">
                  <div className="space-y-3">
                    {["タスク", "チャット", "設定"].map((item, i) => (
                      <div
                        key={item}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                          i === 0
                            ? "bg-indigo-50 text-indigo-700 font-medium"
                            : "text-neutral-600"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${i === 0 ? "bg-indigo-500" : "bg-neutral-300"}`} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  {[
                    { title: "予算承認依頼", sender: "田中部長", priority: "高", color: "red" },
                    { title: "Q3レビュー日程調整", sender: "山田さん", priority: "中", color: "yellow" },
                    { title: "セキュリティパッチ適用確認", sender: "IT部門", priority: "高", color: "red" },
                  ].map((task) => (
                    <div key={task.title} className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm text-neutral-900">{task.title}</div>
                        <div className="text-xs text-neutral-400 mt-1">{task.sender} · Teams</div>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          task.color === "red"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Download() {
  return (
    <section id="download" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl px-8 md:px-16 py-16 text-center text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              現在ベータ版を無料公開中
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              今すぐ無料でダウンロード
            </h2>
            <p className="text-indigo-200 text-lg mb-3 max-w-xl mx-auto">
              インストールして会社のMicrosoftアカウントでログインするだけ。
              すぐに使い始められます。
            </p>

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-10">
              <svg className="w-4 h-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              バージョン v0.1.0 · ベータ
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#download"
                className="inline-flex items-center justify-center gap-3 bg-white text-indigo-700 font-semibold rounded-xl px-8 py-4 hover:bg-indigo-50 transition-colors shadow-lg w-full sm:w-auto"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-indigo-400 font-normal">Windows版</div>
                  <div>インストーラー (.msi)</div>
                </div>
              </a>

              <a
                href="#download"
                className="inline-flex items-center justify-center gap-3 bg-white/10 border border-white/30 text-white font-semibold rounded-xl px-8 py-4 hover:bg-white/20 transition-colors w-full sm:w-auto"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13v6l5 3-.75 1.3L10 14V7h1z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-indigo-300 font-normal">macOS版</div>
                  <div>ディスクイメージ (.dmg)</div>
                </div>
              </a>
            </div>

            <p className="mt-8 text-sm text-indigo-300">
              Windows 10 (64bit) 以降 · macOS 12 Monterey 以降 · 商用利用可
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

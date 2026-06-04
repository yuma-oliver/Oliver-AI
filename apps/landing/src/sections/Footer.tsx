export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">O</span>
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Oliver AI</div>
              <div className="text-xs text-neutral-500">Claude API搭載 · 社内向けAI秘書</div>
            </div>
          </div>

          <div className="flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-white transition-colors">機能</a>
            <a href="#how-to-use" className="hover:text-white transition-colors">使い方</a>
            <a href="#download" className="hover:text-white transition-colors">ダウンロード</a>
          </div>

          <div className="text-xs text-neutral-600">
            © 2025 Oliver Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

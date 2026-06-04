import { useAuth } from "../contexts/AuthContext";

export default function SettingsView() {
  const { user, login, logout, loading } = useAuth();

  return (
    <div className="flex flex-col h-full">
      <header className="h-14 flex items-center px-6 bg-white border-b border-neutral-200 shrink-0">
        <h1 className="text-base font-semibold text-neutral-900">設定</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 max-w-2xl">
        {/* Microsoft Account */}
        <section className="bg-white rounded-xl border border-neutral-200 p-5">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">Microsoftアカウント</h2>
          {loading ? (
            <p className="text-sm text-neutral-400">読み込み中...</p>
          ) : user ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900">{user.name ?? user.username}</p>
                <p className="text-xs text-neutral-400">{user.username}</p>
              </div>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">未ログイン</p>
              <button
                onClick={login}
                className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg px-4 py-2 transition-colors"
              >
                Microsoftアカウントでログイン
              </button>
            </div>
          )}
        </section>

        {/* Sync Settings */}
        <section className="bg-white rounded-xl border border-neutral-200 p-5">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">同期設定</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-500 block mb-1">監視間隔</label>
              <select disabled className="text-sm border border-neutral-200 rounded-lg px-3 py-2 w-full bg-neutral-50 text-neutral-400">
                <option>5分ごと</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 block mb-1">朝のブリーフィング時刻</label>
              <input type="time" disabled defaultValue="08:30" className="text-sm border border-neutral-200 rounded-lg px-3 py-2 w-full bg-neutral-50 text-neutral-400" />
            </div>
          </div>
        </section>

        {/* Supabase */}
        <section className="bg-white rounded-xl border border-neutral-200 p-5">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">Supabase接続情報</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-neutral-500 block mb-1">URL</label>
              <input disabled defaultValue="https://rawkjauphysykxjjzklr.supabase.co" className="text-sm border border-neutral-200 rounded-lg px-3 py-2 w-full bg-neutral-50 text-neutral-400 font-mono" />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 block mb-1">Publishable Key</label>
              <input disabled defaultValue="sb_publishable_Ol_T__BBSdTSWQz5zG7pCw_7eK7YILO" className="text-sm border border-neutral-200 rounded-lg px-3 py-2 w-full bg-neutral-50 text-neutral-400 font-mono" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

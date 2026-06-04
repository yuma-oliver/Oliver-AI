import Hero from "./sections/Hero";
import Features from "./sections/Features";
import HowToUse from "./sections/HowToUse";
import Download from "./sections/Download";
import Footer from "./sections/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">O</span>
            </div>
            <span className="text-lg font-semibold text-neutral-900">Oliver AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">機能</a>
            <a href="#how-to-use" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">使い方</a>
            <a href="#download" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">ダウンロード</a>
          </div>
          <a
            href="#download"
            className="hidden md:inline-flex items-center justify-center rounded-md bg-indigo-600 text-white text-sm font-medium px-4 py-2 hover:bg-indigo-700 transition-colors"
          >
            無料でダウンロード
          </a>
        </div>
      </nav>
      <main className="pt-16">
        <Hero />
        <Features />
        <HowToUse />
        <Download />
      </main>
      <Footer />
    </div>
  );
}

import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TaskView from "./views/TaskView";
import ChatView from "./views/ChatView";
import SettingsView from "./views/SettingsView";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-neutral-50">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<TaskView />} />
            <Route path="/chat" element={<ChatView />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

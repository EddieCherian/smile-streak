import { useEffect, useState } from "react";
import NavTabs from "./components/NavTabs";
import Home from "./components/Home";
import Today from "./components/Today";
import Progress from "./components/Progress";
import Tips from "./components/Tips";
import Reminders from "./components/Reminders";
import Scan from "./components/Scan";
import Dentists from "./components/Dentists";
import Report from "./components/Report";
import Insights from "./components/Insights";
import Mission from "./components/Mission";
import Legal from "./components/Legal";
import { storage } from "./utils/storage";
import { scheduleDailyNotifications } from "./utils/scheduleNotifications";
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  const [habitData, setHabitData] = useState(() =>
    storage.get("habitData", {})
  );

  useEffect(() => {
    storage.set("habitData", habitData);
  }, [habitData]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      scheduleDailyNotifications();
    }
  }, []);

  // GOOGLE LOGIN FUNCTION
  function login() {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("User:", result.user);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* PROFESSIONAL HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* LEFT: LOGO + BRAND */}
            <div className="flex items-center gap-3">
              <img 
                src="/icon-511.png" 
                alt="Smile Streak" 
                className="w-10 h-10 rounded-xl shadow-md"
              />
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Smile Streak
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Build better dental habits
                </p>
              </div>
            </div>

            {/* RIGHT: GOOGLE SIGN IN */}
            <button
              onClick={login}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all font-semibold text-sm text-gray-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="hidden sm:inline">Sign in with Google</span>
              <span className="sm:hidden">Sign in</span>
            </button>
          </div>
        </div>
      </header>

      {/* NAV TABS */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      {/* PAGE CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {activeTab === "home" && <Home setActiveTab={setActiveTab} />}
        {activeTab === "today" && (
          <Today habitData={habitData} setHabitData={setHabitData} />
        )}
        {activeTab === "progress" && <Progress habitData={habitData} />}
        {activeTab === "tips" && <Tips />}
        {activeTab === "reminders" && <Reminders />}
        {activeTab === "scan" && <Scan />}
        {activeTab === "dentists" && <Dentists />}
        {activeTab === "report" && <Report habitData={habitData} />}
        {activeTab === "insights" && <Insights habitData={habitData} />}
        {activeTab === "mission" && <Mission />}
        {activeTab === "legal" && <Legal />}
      </main>
    </div>
  );
}

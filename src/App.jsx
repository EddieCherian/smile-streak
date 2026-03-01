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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 text-gray-800">

      {/* CLEAN CLAUDE-STYLE HEADER */}
      <header className="px-6 pt-10 pb-6 flex flex-col items-center gap-3 border-b border-gray-100 bg-white/70 backdrop-blur">
        
        <h1 className="text-3xl font-semibold tracking-tight">
          Smile Streak
        </h1>

        <p className="text-sm text-gray-500">
          Build a perfect daily dental routine
        </p>

        {/* GOOGLE SIGN IN BUTTON */}
        <button
          onClick={login}
          className="mt-2 px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:opacity-90 transition"
        >
          Sign in with Google
        </button>

      </header>

      {/* NAV TABS */}
      <div className="px-4 py-2">
        <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* PAGE CONTENT */}
      <main className="p-4 space-y-6 pb-24">
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
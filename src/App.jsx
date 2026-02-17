import { useEffect, useState } from "react";
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
import { storage } from "./utils/storage";
import { scheduleDailyNotifications } from "./utils/scheduleNotifications";
import "./App.css";

export default function App() {
  // ✅ start on home instead of today
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 text-gray-800">
      {/* HEADER */}
      <header className="px-6 pt-8 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Smile Streak 😁
        </h1>
        <p className="text-sm text-gray-500">
          Build a perfect daily dental routine
        </p>
      </header>

      {/* TABS */}
      <nav className="flex gap-2 px-4 py-2 overflow-x-auto">
        {[
          "home",        // ✅ ADDED
          "today",
          "progress",
          "tips",
          "reminders",
          "scan",
          "dentists",
          "report",
          "insights",
          "mission"
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition
              ${
                activeTab === tab
                  ? "bg-cyan-500 text-white shadow"
                  : "bg-white text-gray-600 shadow-sm"
              }`}
          >
            {tab[0].toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      <main className="p-4 space-y-6 pb-24">
        {activeTab === "home" && <Home />} {/* ✅ ADDED */}
        {activeTab === "today" && (
          <Today habitData={habitData} setHabitData={setHabitData} />
        )}
        {activeTab === "progress" && <Progress habitData={habitData} />}
        {activeTab === "tips" && <Tips />}
        {activeTab === "reminders" && <Reminders />}
        {activeTab === "scan" && <Scan />}
        {activeTab === "dentists" && <Dentists />}
        {activeTab === "report" && (
          <Report habitData={habitData} />
        )}
        {activeTab === "insights" && (
          <Insights habitData={habitData} />
        )}
        {activeTab === "mission" && <Mission />}
      </main>
    </div>
  );
}

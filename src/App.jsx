import { useEffect, useState } from "react";
import { TIPS, ACHIEVEMENTS } from "./data/index.js";
import { getDateKey } from "./utils/date";
import { storage } from "./utils/storage";
import { getCompletionPercent, calculateStreaks } from "./utils/progress";

export default function App() {
  const [activeTab, setActiveTab] = useState("today");
  const [habitData, setHabitData] = useState(() =>
    storage.get("habitData", {})
  );

  useEffect(() => {
    storage.set("habitData", habitData);
  }, [habitData]);

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
        {["today", "progress", "tips", "reminders"].map(tab => (
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
        {activeTab === "today" && (
          <Today habitData={habitData} setHabitData={setHabitData} />
        )}
        {activeTab === "progress" && <Progress habitData={habitData} />}
        {activeTab === "tips" && <Tips />}
        {activeTab === "reminders" && <Reminders />}
      </main>
    </div>
  );
}

/* ───────────────── TODAY ───────────────── */

function Today({ habitData, setHabitData }) {
  const today = getDateKey();
  const todayData = habitData[today] || {
    morning: false,
    night: false,
    floss: false
  };

  const toggle = key => {
    setHabitData(prev => ({
      ...prev,
      [today]: { ...todayData, [key]: !todayData[key] }
    }));
  };

  const percent = getCompletionPercent(todayData);

  return (
    <section className="space-y-6">
      {/* PROGRESS CARD */}
      <div className="bg-white rounded-3xl p-6 shadow-md">
        <p className="text-sm font-semibold text-gray-500 mb-2">
          Today’s Progress
        </p>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">{percent}% completed</p>
      </div>

      {/* TASKS */}
      <div className="space-y-3">
        <Task
          label="Morning Brushing"
          icon="🌅"
          done={todayData.morning}
          onClick={() => toggle("morning")}
        />
        <Task
          label="Night Brushing"
          icon="🌙"
          done={todayData.night}
          onClick={() => toggle("night")}
        />
        <Task
          label="Flossing"
          icon="🧵"
          done={todayData.floss}
          onClick={() => toggle("floss")}
        />
      </div>
    </section>
  );
}

function Task({ label, icon, done, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-5 rounded-2xl border transition
        ${
          done
            ? "bg-green-50 border-green-400"
            : "bg-white border-gray-200 hover:bg-gray-50"
        }`}
    >
      <div className="flex items-center gap-4">
        <span className="text-2xl">{icon}</span>
        <span className="font-semibold">{label}</span>
      </div>
      <span className="text-xl">{done ? "✅" : "⭕"}</span>
    </button>
  );
}

/* ───────────────── PROGRESS ───────────────── */

function Progress({ habitData }) {
  const days = Object.values(habitData);
  const completed = days.filter(
    d => d?.morning && d?.night && d?.floss
  ).length;

  const { currentStreak, longestStreak } =
    calculateStreaks(habitData);

  return (
    <section className="space-y-6">
      {/* STATS */}
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Completed" value={completed} />
        <Stat label="Current Streak" value={currentStreak} />
        <Stat label="Longest" value={longestStreak} />
      </div>

      {/* ACHIEVEMENTS */}
      <div className="bg-white rounded-3xl p-6 shadow-md">
        <h3 className="font-bold mb-4">Achievements</h3>
        <div className="grid grid-cols-3 gap-4">
          {ACHIEVEMENTS.map(a => (
            <div
              key={a.id}
              className={`p-4 rounded-2xl text-center transition
                ${
                  completed >= a.requirement
                    ? "bg-yellow-100"
                    : "bg-gray-100 opacity-50"
                }`}
            >
              <div className="text-3xl">{a.icon}</div>
              <p className="text-xs font-semibold mt-1">{a.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-extrabold text-cyan-600">{value}</p>
    </div>
  );
}

/* ───────────────── TIPS ───────────────── */

function Tips() {
  return (
    <div className="space-y-4">
      {TIPS.map(tip => (
        <div
          key={tip.id}
          className="bg-white p-5 rounded-3xl shadow-md"
        >
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">{tip.icon}</span>
            <h3 className="font-bold">{tip.title}</h3>
          </div>
          <p className="text-sm text-gray-600">{tip.content}</p>
          <p className="text-xs text-cyan-600 mt-2">
            Source: {tip.source}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ───────────────── REMINDERS ───────────────── */

function Reminders() {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-md">
      <h2 className="font-bold text-lg mb-2">Reminders</h2>
      <p className="text-sm text-gray-600">
        Notification scheduling is a future feature.
      </p>
    </div>
  );
}

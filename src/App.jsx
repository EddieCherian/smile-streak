import { useEffect, useMemo, useState } from "react";

/* -------------------- DATA -------------------- */

const TIPS = [
  {
    title: "Don’t rinse after brushing",
    content:
      "Spit, don’t rinse. This allows fluoride to stay on your teeth longer and strengthen enamel.",
    source: "NHS UK"
  },
  {
    title: "Floss before brushing",
    content:
      "Flossing first removes plaque so fluoride toothpaste can reach between teeth.",
    source: "American Dental Association"
  },
  {
    title: "Brush for 2 minutes",
    content:
      "Two full minutes ensures all tooth surfaces are cleaned properly.",
    source: "CDC"
  }
];

const ACHIEVEMENTS = [
  { id: 1, label: "1 Day", requirement: 1, icon: "🥉" },
  { id: 3, label: "3 Days", requirement: 3, icon: "🥈" },
  { id: 7, label: "7 Days", requirement: 7, icon: "🥇" }
];

/* -------------------- HELPERS -------------------- */

const todayKey = () => new Date().toISOString().slice(0, 10);

function calculateStreak(data) {
  let current = 0;
  let longest = 0;
  let temp = 0;

  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);

    const day = data[key];
    const complete = day?.morning && day?.night && day?.floss;

    if (complete) {
      temp++;
      longest = Math.max(longest, temp);
      if (i === current) current++;
    } else {
      temp = 0;
    }
  }

  return { current, longest };
}

/* -------------------- APP -------------------- */

export default function App() {
  const [activeTab, setActiveTab] = useState("today");
  const [habitData, setHabitData] = useState({});

  /* Persist data */
  useEffect(() => {
    const saved = localStorage.getItem("habitData");
    if (saved) setHabitData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("habitData", JSON.stringify(habitData));
  }, [habitData]);

  const { current, longest } = useMemo(
    () => calculateStreak(habitData),
    [habitData]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">

      {/* HEADER */}
      <header className="p-4 text-center">
        <h1 className="text-2xl font-bold">Smile Streak</h1>
        <p className="text-sm text-gray-500">
          Build healthy dental habits
        </p>
      </header>

      {/* STREAK BAR */}
      <div className="px-4">
        <div className="bg-white rounded-xl shadow p-4 flex justify-between text-center">
          <div>
            <p className="text-xs text-gray-500">Current Streak</p>
            <p className="text-xl font-bold text-orange-500">🔥 {current}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Best Streak</p>
            <p className="text-xl font-bold text-yellow-500">🏆 {longest}</p>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex gap-2 p-4 justify-center">
        {["today", "progress", "tips", "reminders"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              activeTab === tab
                ? "bg-cyan-500 text-white"
                : "bg-white text-gray-600"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      <main className="p-4 pb-24 max-w-md mx-auto">
        {activeTab === "today" && (
          <Today habitData={habitData} setHabitData={setHabitData} />
        )}
        {activeTab === "progress" && (
          <Progress habitData={habitData} />
        )}
        {activeTab === "tips" && <Tips />}
        {activeTab === "reminders" && <Reminders />}
      </main>
    </div>
  );
}

/* -------------------- TODAY -------------------- */

function Today({ habitData, setHabitData }) {
  const today = todayKey();
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

  const completed = Object.values(todayData).filter(Boolean).length;
  const percent = Math.round((completed / 3) * 100);

  return (
    <div className="bg-white rounded-2xl p-6 shadow space-y-4">
      <h2 className="font-bold text-lg">Today’s Routine</h2>

      {[
        ["morning", "Morning Brush"],
        ["night", "Night Brush"],
        ["floss", "Floss"]
      ].map(([key, label]) => (
        <button
          key={key}
          onClick={() => toggle(key)}
          className={`w-full flex justify-between items-center p-4 rounded-xl border ${
            todayData[key]
              ? "bg-green-50 border-green-400"
              : "bg-gray-50"
          }`}
        >
          <span>{label}</span>
          <span className="text-xl">
            {todayData[key] ? "✅" : "⭕"}
          </span>
        </button>
      ))}

      <div>
        <p className="text-xs mb-1 text-gray-500">Daily Progress</p>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-3 bg-gradient-to-r from-cyan-500 to-blue-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------- PROGRESS -------------------- */

function Progress({ habitData }) {
  const completedDays = Object.values(habitData).filter(
    d => d?.morning && d?.night && d?.floss
  ).length;

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-2xl shadow text-center">
        <p className="text-sm text-gray-500">Completed Days</p>
        <p className="text-3xl font-bold text-cyan-600">
          {completedDays}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-bold mb-3">Achievements</h3>
        <div className="grid grid-cols-3 gap-3">
          {ACHIEVEMENTS.map(a => (
            <div
              key={a.id}
              className={`p-4 rounded-xl text-center ${
                completedDays >= a.requirement
                  ? "bg-yellow-100"
                  : "bg-gray-100 opacity-40"
              }`}
            >
              <div className="text-2xl">{a.icon}</div>
              <p className="text-xs">{a.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------- TIPS -------------------- */

function Tips() {
  return (
    <div className="space-y-4">
      {TIPS.map((tip, i) => (
        <div key={i} className="bg-white p-5 rounded-2xl shadow">
          <h3 className="font-bold">{tip.title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {tip.content}
          </p>
          <p className="text-xs text-cyan-600 mt-2">
            Source: {tip.source}
          </p>
        </div>
      ))}
    </div>
  );
}

/* -------------------- REMINDERS -------------------- */

function Reminders() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="font-bold mb-2">Reminders</h2>
      <p className="text-sm text-gray-600">
        Notification reminders require browser permissions.
        (Demo placeholder)
      </p>
    </div>
  );
}

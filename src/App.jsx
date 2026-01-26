import { useEffect, useMemo, useState } from "react";
import { TIPS, ACHIEVEMENTS } from "./data";
import "./App.css";

const todayKey = () => new Date().toISOString().slice(0, 10);

export default function App() {
  const [activeTab, setActiveTab] = useState("today");
  const [habitData, setHabitData] = useState({});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">

      {/* NAVIGATION */}
      <nav className="flex gap-2 p-4">
        {["today", "progress", "tips", "reminders"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-semibold ${
              activeTab === tab
                ? "bg-cyan-500 text-white"
                : "bg-white text-gray-600"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT */}
      <main className="p-4 pb-20">
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
function Today({ habitData, setHabitData }) {
  const today = todayKey();
  const todayData = habitData[today] || {
    morning: false,
    night: false,
    floss: false
  };

  const toggle = (key) => {
    setHabitData(prev => ({
      ...prev,
      [today]: {
        ...todayData,
        [key]: !todayData[key]
      }
    }));
  };

  const completedCount = Object.values(todayData).filter(Boolean).length;
  const percent = Math.round((completedCount / 3) * 100);

  return (
    <div className="bg-white rounded-2xl p-6 shadow space-y-4">
      <h2 className="text-xl font-bold">Today's Routine</h2>

      {["morning", "night", "floss"].map(task => (
        <button
          key={task}
          onClick={() => toggle(task)}
          className={`w-full flex justify-between items-center p-4 rounded-xl border ${
            todayData[task]
              ? "bg-green-50 border-green-400"
              : "bg-gray-50"
          }`}
        >
          <span className="capitalize">{task} brushing</span>
          <span>{todayData[task] ? "✅" : "⭕"}</span>
        </button>
      ))}

      <div>
        <p className="text-sm mb-1">Daily Progress</p>
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
function Progress({ habitData }) {
  const days = Object.values(habitData);
  const completedDays = days.filter(d =>
    d.morning && d.night && d.floss
  ).length;

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-2xl shadow text-center">
        <h3 className="font-bold text-lg">Total Completed Days</h3>
        <p className="text-3xl font-bold text-cyan-600">
          {completedDays}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-bold mb-4">Achievements</h3>
        <div className="grid grid-cols-3 gap-3">
          {ACHIEVEMENTS.map(a => (
            <div
              key={a.id}
              className={`p-4 rounded-xl text-center ${
                completedDays >= a.requirement
                  ? "bg-yellow-100"
                  : "bg-gray-100 opacity-50"
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
function Tips() {
  return (
    <div className="space-y-4">
      {TIPS.map((tip, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-2xl shadow"
        >
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
function Reminders() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="font-bold text-lg mb-2">Reminders</h2>
      <p className="text-sm text-gray-600">
        Reminder scheduling requires notifications and service workers.
        (Claude demo feature)
      </p>
    </div>
  );
}

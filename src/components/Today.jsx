import { useEffect, useState } from "react";
import { getDateKey } from "../utils/date";

const BRUSH_TIME = 120; // seconds
const TASKS = ["morning", "night", "floss"];

export default function Today({ habitData, setHabitData }) {
  const today = getDateKey();

  const todayData = habitData[today] || {
    morning: false,
    night: false,
    floss: false,
  };

  const [activeTimer, setActiveTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(BRUSH_TIME);

  /* ───────── HELPERS ───────── */

  const completedCount = Object.values(todayData).filter(Boolean).length;
  const percent = Math.round((completedCount / 3) * 100);

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const toggleTask = (task) => {
    setHabitData((prev) => ({
      ...prev,
      [today]: {
        ...todayData,
        [task]: !todayData[task],
      },
    }));
  };

  /* ───────── TIMER LOGIC ───────── */

  useEffect(() => {
    if (!activeTimer) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          toggleTask(activeTimer);
          setActiveTimer(null);
          return BRUSH_TIME;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  /* ───────── UI COPY ───────── */

  const dailyMessage = (() => {
    if (percent === 100) return "Perfect day 💎 Your teeth thank you.";
    if (percent >= 66) return "Almost there 👀 Finish strong.";
    if (percent >= 33) return "Nice start 🪥 Keep it going.";
    return "Let’s get started 😁";
  })();

  /* ───────── WEEKLY DATA (LOCAL) ───────── */

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const data = habitData[key];
    const count = data
      ? Object.values(data).filter(Boolean).length
      : 0;

    return {
      key,
      status:
        count === 3 ? "full" : count > 0 ? "partial" : "empty",
    };
  });

  /* ───────── RENDER ───────── */

  return (
    <section className="space-y-6">
      {/* DAILY MESSAGE */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 rounded-3xl shadow-md">
        <h2 className="text-xl font-bold">Today</h2>
        <p className="mt-1 opacity-90">{dailyMessage}</p>
      </div>

      {/* PROGRESS */}
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
        <p className="mt-2 text-sm text-gray-500">
          {percent}% completed
        </p>
      </div>

      {/* WEEKLY CALENDAR */}
      <div className="bg-white p-5 rounded-3xl shadow-md">
        <p className="text-sm font-semibold text-gray-500 mb-3">
          Last 7 Days
        </p>
        <div className="flex justify-between">
          {last7Days.map((d) => (
            <div
              key={d.key}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold
                ${
                  d.status === "full"
                    ? "bg-green-400 text-white"
                    : d.status === "partial"
                    ? "bg-yellow-300 text-gray-800"
                    : "bg-gray-200 text-gray-400"
                }`}
            >
              {d.status === "full" ? "✓" : ""}
            </div>
          ))}
        </div>
      </div>

      {/* TASKS */}
      {["morning", "night"].map((task) => {
        const isDone = todayData[task];
        const isRunning = activeTimer === task;
        const isBlocked = activeTimer && activeTimer !== task;

        return (
          <button
            key={task}
            disabled={isBlocked}
            onClick={() => {
              if (isDone) {
                toggleTask(task);
              } else {
                setActiveTimer(task);
                setTimeLeft(BRUSH_TIME);
              }
            }}
            className={`w-full flex justify-between items-center p-5 rounded-2xl border transition
              ${
                isDone
                  ? "bg-green-50 border-green-400"
                  : isBlocked
                  ? "bg-gray-100 opacity-50 cursor-not-allowed"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
          >
            <span className="capitalize font-semibold">
              {task} brushing
            </span>

            <div className="flex items-center gap-3">
              {isRunning && (
                <span className="font-mono text-sm text-cyan-600">
                  {formatTime(timeLeft)}
                </span>
              )}
              <span>{isDone ? "✅" : "🪥"}</span>
            </div>
          </button>
        );
      })}

      {/* FLOSS */}
      <button
        onClick={() => toggleTask("floss")}
        className={`w-full flex justify-between items-center p-5 rounded-2xl border transition
          ${
            todayData.floss
              ? "bg-green-50 border-green-400"
              : "bg-white border-gray-200 hover:bg-gray-50"
          }`}
      >
        <span className="font-semibold">Floss</span>
        <span>{todayData.floss ? "✅" : "🧵"}</span>
      </button>

      {/* STREAK TEASER */}
      {percent === 100 && (
        <div className="text-center text-sm font-semibold text-cyan-600">
          🎉 Perfect day! Streak updated.
        </div>
      )}
    </section>
  );
}

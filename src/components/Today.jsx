import { useEffect, useState } from "react";

const BRUSH_TIME = 120; // 2 minutes

export default function Today({ habitData, setHabitData }) {
  const today = new Date().toISOString().slice(0, 10);

  const todayData = habitData[today] || {
    morning: false,
    night: false,
    floss: false
  };

  /* ---------------- STATE ---------------- */

  const [activeTimer, setActiveTimer] = useState(null); // "morning" | "night" | null
  const [timeLeft, setTimeLeft] = useState(BRUSH_TIME);

  /* ---------------- HELPERS ---------------- */

  const toggle = (key) => {
    setHabitData(prev => ({
      ...prev,
      [today]: {
        ...todayData,
        [key]: true
      }
    }));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* ---------------- TIMER EFFECT ---------------- */

  useEffect(() => {
    if (!activeTimer) return;

    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          toggle(activeTimer);
          setActiveTimer(null);
          return BRUSH_TIME;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  /* ---------------- PROGRESS ---------------- */

  const completedCount = Object.values(todayData).filter(Boolean).length;
  const percent = Math.round((completedCount / 3) * 100);

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-white rounded-2xl p-6 shadow space-y-4">
      <h2 className="text-xl font-bold">Today's Routine</h2>

      {/* MORNING & NIGHT BRUSHING */}
      {["morning", "night"].map(task => {
        const isDisabled =
          todayData[task] || (activeTimer && activeTimer !== task);

        return (
          <button
            key={task}
            disabled={isDisabled}
            onClick={() => {
              setActiveTimer(task);
              setTimeLeft(BRUSH_TIME);
            }}
            className={`w-full flex justify-between items-center p-4 rounded-xl border transition ${
              todayData[task]
                ? "bg-green-50 border-green-400"
                : isDisabled
                ? "bg-gray-100 opacity-50 cursor-not-allowed"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <span className="capitalize">{task} brushing</span>

            <div className="flex items-center gap-3">
              {activeTimer === task && (
                <span className="font-mono text-sm text-cyan-600">
                  {formatTime(timeLeft)}
                </span>
              )}
              <span>{todayData[task] ? "✅" : "🪥"}</span>
            </div>
          </button>
        );
      })}

      {/* FLOSS */}
      <button
        onClick={() => toggle("floss")}
        className={`w-full flex justify-between items-center p-4 rounded-xl border ${
          todayData.floss
            ? "bg-green-50 border-green-400"
            : "bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <span>Floss</span>
        <span>{todayData.floss ? "✅" : "🧵"}</span>
      </button>

      {/* PROGRESS BAR */}
      <div>
        <p className="text-sm mb-1">Daily Progress</p>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-3 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

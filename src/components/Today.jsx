import { useEffect, useState } from "react";
import { getDateKey } from "../utils/date";

const BRUSH_TIME = 120; // seconds

export default function Today({ habitData, setHabitData }) {
  const today = getDateKey();

  const todayData = habitData[today] || {
    morning: false,
    night: false,
    floss: false,
  };

  const [activeTimer, setActiveTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(BRUSH_TIME);

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const completeTask = (task) => {
    setHabitData((prev) => ({
      ...prev,
      [today]: {
        ...todayData,
        [task]: true,
      },
    }));
  };

  useEffect(() => {
    if (!activeTimer) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          completeTask(activeTimer);
          setActiveTimer(null);
          return BRUSH_TIME;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  const completedCount = Object.values(todayData).filter(Boolean).length;
  const percent = Math.round((completedCount / 3) * 100);

  return (
    <section className="space-y-6">
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
        <p className="mt-2 text-sm text-gray-500">{percent}% completed</p>
      </div>

      {/* BRUSHING */}
      {["morning", "night"].map((task) => {
        const isDone = todayData[task];
        const isRunning = activeTimer === task;
        const isBlocked = activeTimer && activeTimer !== task;

        return (
          <button
            key={task}
            disabled={isDone || isBlocked}
            onClick={() => {
              setActiveTimer(task);
              setTimeLeft(BRUSH_TIME);
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
        onClick={() => completeTask("floss")}
        className={`w-full flex justify-between items-center p-5 rounded-2xl border
          ${
            todayData.floss
              ? "bg-green-50 border-green-400"
              : "bg-white border-gray-200 hover:bg-gray-50"
          }`}
      >
        <span className="font-semibold">Floss</span>
        <span>{todayData.floss ? "✅" : "🧵"}</span>
      </button>
    </section>
  );
}

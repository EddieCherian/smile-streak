import { useEffect, useState } from "react";

const BRUSH_TIME = 120;

export default function Today({ habitData, setHabitData }) {
  const today = new Date().toISOString().slice(0, 10);

  const todayData = habitData[today] || {
    morning: false,
    night: false,
    floss: false
  };

  const [activeTimer, setActiveTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(BRUSH_TIME);

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const completeTask = (task) => {
    setHabitData(prev => ({
      ...prev,
      [today]: {
        ...todayData,
        [task]: true
      }
    }));
  };

  useEffect(() => {
    if (!activeTimer) return;

    const interval = setInterval(() => {
      setTimeLeft(t => {
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
    <div className="bg-white rounded-2xl p-6 shadow space-y-4">
      <h2 className="text-xl font-bold">Today's Routine</h2>

      {["morning", "night"].map(task => {
        const isCompleted = todayData[task];
        const isRunning = activeTimer === task;
        const isBlocked = activeTimer && activeTimer !== task;

        return (
          <button
            key={task}
            disabled={isCompleted || isBlocked}
            onClick={() => {
              setActiveTimer(task);
              setTimeLeft(BRUSH_TIME);
            }}
            className={`w-full flex justify-between items-center p-4 rounded-xl border transition ${
              isCompleted
                ? "bg-green-50 border-green-400"
                : isBlocked
                ? "bg-gray-100 opacity-50 cursor-not-allowed"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <span className="capitalize">{task} brushing</span>

            <div className="flex items-center gap-3">
              {isRunning && (
                <span className="font-mono text-sm text-cyan-600">
                  {formatTime(timeLeft)}
                </span>
              )}
              <span>{isCompleted ? "✅" : "🪥"}</span>
            </div>
          </button>
        );
      })}

      {/* FLOSS */}
      <button
        onClick={() => completeTask("floss")}
        className={`w-full flex justify-between items-center p-4 rounded-xl border ${
          todayData.floss
            ? "bg-green-50 border-green-400"
            : "bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <span>Floss</span>
        <span>{todayData.floss ? "✅" : "🧵"}</span>
      </button>

      {/* PROGRESS */}
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
export default function Today(...) { ... }

import { useEffect, useState } from "react";
import { getDateKey } from "../utils/date";
import { getYesterdayKey } from "../utils/streak";

const BRUSH_TIME = 120; // seconds
const RECOVERY_KEY = "__lastRecoveryUsed";

export default function Today({ habitData, setHabitData }) {
  const today = getDateKey();
  const yesterday = getYesterdayKey(today);

  const todayData = habitData[today] || {
    morning: false,
    night: false,
    floss: false,
  };

  const yesterdayData = habitData[yesterday];

  // 🧠 Recovery availability (once per 7 days)
  const lastRecovery = habitData[RECOVERY_KEY];
  const lastRecoveryDate = lastRecovery ? new Date(lastRecovery) : null;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recoveryAvailable =
    !lastRecoveryDate || lastRecoveryDate < oneWeekAgo;

  const missedYesterday =
    yesterdayData &&
    ["morning", "night", "floss"].some(
      (task) => yesterdayData[task] === false
    );

  const isRecoveryDay = missedYesterday && recoveryAvailable;

  const [activeTimer, setActiveTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(BRUSH_TIME);
  const [showStreak, setShowStreak] = useState(false);

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // 🔁 Toggle task + streak detection
  const toggleTask = (task) => {
    const nextValue = !todayData[task];
    const completedNow = Object.values({
      ...todayData,
      [task]: nextValue,
    }).filter(Boolean).length;

    setHabitData((prev) => {
      const updated = {
        ...prev,
        [today]: {
          ...todayData,
          [task]: nextValue,
        },
      };

      // 🛟 Consume recovery only when day is completed
      if (completedNow === 3 && isRecoveryDay) {
        updated[RECOVERY_KEY] = new Date().toISOString();
      }

      return updated;
    });

    if (completedNow === 3) {
      setShowStreak(true);
      setTimeout(() => setShowStreak(false), 1200);
    }
  };

  // ⏱️ Timer logic
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

  const completedCount = Object.values(todayData).filter(Boolean).length;
  const percent = Math.round((completedCount / 3) * 100);

  return (
    <>
      {/* 🔥 STREAK POPUP */}
      {showStreak && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white px-8 py-6 rounded-3xl shadow-xl animate-pop animate-glow">
            <p className="text-3xl font-extrabold text-orange-500 text-center">
              🔥 Day Complete!
            </p>
            <p className="text-sm text-gray-500 text-center mt-1">
              {isRecoveryDay ? "Nice recovery 😤" : "Great consistency 👏"}
            </p>
          </div>
        </div>
      )}

      <section className="space-y-6">
        {/* 🛟 RECOVERY DAY BANNER */}
        {isRecoveryDay && (
          <div className="bg-orange-50 border border-orange-300 rounded-2xl p-4 animate-fade">
            <p className="font-semibold text-orange-600">
              Recovery Day 💪
            </p>
            <p className="text-sm text-orange-500">
              You missed yesterday — recovery available once this week.
            </p>
          </div>
        )}

        {/* PROGRESS */}
        <div className="bg-white rounded-3xl p-6 shadow-md animate-fade">
          <p className="text-sm font-semibold text-gray-500 mb-2">
            Today’s Progress
          </p>

          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-[width] duration-700 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>

          <p className="mt-2 text-sm text-gray-500">{percent}% completed</p>
        </div>

        {/* BRUSHING TASKS */}
        {["morning", "night"].map((task) => {
          const isDone = todayData[task];
          const isRunning = activeTimer === task;
          const isBlocked = activeTimer && activeTimer !== task;

          return (
            <button
              key={task}
              disabled={isBlocked}
              onClick={() => {
                if (isDone) toggleTask(task);
                else {
                  setActiveTimer(task);
                  setTimeLeft(BRUSH_TIME);
                }
              }}
              className={`w-full flex justify-between items-center p-5 rounded-2xl border transition-all duration-300
                ${
                  isDone
                    ? "bg-green-50 border-green-400"
                    : isBlocked
                    ? "bg-gray-100 opacity-50 cursor-not-allowed"
                    : "bg-white border-gray-200 hover:scale-[1.02] hover:shadow-md"
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
                <span className={isDone ? "animate-pop" : ""}>
                  {isDone ? "✅" : "🪥"}
                </span>
              </div>
            </button>
          );
        })}

        {/* FLOSS */}
        <button
          onClick={() => toggleTask("floss")}
          className={`w-full flex justify-between items-center p-5 rounded-2xl border transition-all duration-300
            ${
              todayData.floss
                ? "bg-green-50 border-green-400"
                : "bg-white border-gray-200 hover:scale-[1.02] hover:shadow-md"
            }`}
        >
          <span className="font-semibold">Floss</span>
          <span className={todayData.floss ? "animate-pop" : ""}>
            {todayData.floss ? "✅" : "🧵"}
          </span>
        </button>
      </section>
    </>
  );
}

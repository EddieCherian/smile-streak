import { useEffect, useState } from "react";
import { getDateKey } from "../utils/date.js";
import { getYesterdayKey } from "../utils/streak.js";

const BRUSH_TIME = 120;
const RECOVERY_KEY = "__lastRecoveryUsed";

export default function Today({ habitData, setHabitData }) {
  const today = getDateKey();
  const yesterday = getYesterdayKey(today);

  const todayData = habitData[today] || {
    morning: false,
    night: false,
    floss: false,
    reflection: null,
  };

  const yesterdayData = habitData[yesterday];

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
  const [timerEnabled, setTimerEnabled] = useState(false);

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

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

  const completedCount = ["morning", "night", "floss"]
    .filter((k) => todayData[k]).length;

  const percent = Math.round((completedCount / 3) * 100);

  return (
    <>
      {/* STREAK MODAL */}
      {showStreak && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white px-8 py-6 rounded-3xl shadow-xl">
            <p className="text-3xl font-extrabold text-orange-500 text-center">
              Day Complete
            </p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white mb-6 relative">
        <h1 className="text-2xl font-extrabold">Smile Streak</h1>
        <p className="text-sm opacity-90">Complete your routine today</p>

        {/* TIMER SMALL BOX */}
        <div className="absolute top-4 right-4 bg-gray-100 text-gray-800 rounded-xl px-3 py-2 text-xs shadow">
          <button
            onClick={() =>
              setTimerEnabled((v) => {
                if (v && activeTimer) {
                  toggleTask(activeTimer);
                  setActiveTimer(null);
                  setTimeLeft(BRUSH_TIME);
                }
                return !v;
              })
            }
            className="font-semibold"
          >
            Timer: {timerEnabled ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 text-center border">
          <p className="text-sm text-gray-500">Current Streak</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center border">
          <p className="text-sm text-gray-500">Best Streak</p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>

      {/* PROGRESS BAR (RESTORED) */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-1">Daily Progress</p>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-right text-xs text-gray-500 mt-1">
          {percent}%
        </p>
      </div>

      {/* TASKS */}
      <section className="space-y-4">
        {["morning", "night"].map((task) => {
          const isDone = todayData[task];
          const isRunning = activeTimer === task;

          return (
            <button
              key={task}
              onClick={() => {
                if (isDone) {
                  toggleTask(task);
                } else if (timerEnabled) {
                  setActiveTimer(task);
                  setTimeLeft(BRUSH_TIME);
                } else {
                  toggleTask(task);
                }
              }}
              className={`w-full flex justify-between items-center p-5 rounded-2xl border
                ${isDone ? "bg-green-50 border-green-400" : "bg-white"}`}
            >
              <span className="capitalize font-semibold">
                {task} brushing
              </span>
              <span className="text-sm">
                {isRunning ? formatTime(timeLeft) : isDone ? "Done" : ""}
              </span>
            </button>
          );
        })}

        <button
          onClick={() => toggleTask("floss")}
          className={`w-full flex justify-between items-center p-5 rounded-2xl border
            ${todayData.floss ? "bg-green-50 border-green-400" : "bg-white"}`}
        >
          <span className="font-semibold">Floss</span>
          <span>{todayData.floss ? "Done" : ""}</span>
        </button>
      </section>
    </>
  );
}

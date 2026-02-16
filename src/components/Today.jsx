import { useEffect, useState } from "react";
import { getDateKey } from "../utils/date.js";
import { getYesterdayKey } from "../utils/date.js";
import { calculateStreaks } from "../utils/streak.js";

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

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    forceUpdate((v) => v + 1);
  }, [habitData]);

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
      setTimeout(() => setShowStreak(false), 1400);
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

  const { current, longest } = calculateStreaks(habitData);

  return (
    <>
      {showStreak && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white px-10 py-8 rounded-3xl shadow-2xl animate-[scaleFade_0.6s_ease-out]">
            <p className="text-4xl font-extrabold text-orange-500 text-center">
              Day Complete
            </p>
            <p className="text-sm text-gray-500 text-center mt-2">
              {isRecoveryDay
                ? "Recovered and back on track"
                : "Perfect consistency"}
            </p>
          </div>
        </div>
      )}

      <div className="rounded-3xl p-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icon-511.png" alt="Smile Streak" className="h-16 w-16" />
            <div>
              <h1 className="text-2xl font-extrabold">Smile Streak</h1>
              <p className="text-sm opacity-90">Complete your routine today</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs opacity-80">Current Streak</p>
            <p className="text-2xl font-extrabold">{current}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 text-center border">
          <p className="text-sm text-gray-500">Current Streak</p>
          <p className="text-2xl font-bold">{current}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center border">
          <p className="text-sm text-gray-500">Best Streak</p>
          <p className="text-2xl font-bold">{longest}</p>
        </div>
      </div>

      <div className="mb-6 relative pb-16">
        <p className="text-sm text-gray-600 mb-1">Daily Progress</p>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-right text-xs text-gray-500 mt-1">{percent}%</p>

        <div className="absolute right-0 mt-3">
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
            className="flex items-center gap-2 bg-gray-100 text-gray-800 rounded-xl px-3 py-2 text-xs shadow font-semibold"
          >
            <span>Timer {timerEnabled ? "ON" : "OFF"}</span>
            <span>⏰</span>
          </button>
        </div>
      </div>

      <section className="space-y-4 mt-24">
        {["morning", "night"].map((task) => {
          const isDone = todayData[task];
          const isRunning = activeTimer === task;

          return (
            <button
              key={task}
              onClick={() => {
                if (isDone) toggleTask(task);
                else if (timerEnabled) {
                  setActiveTimer(task);
                  setTimeLeft(BRUSH_TIME);
                } else toggleTask(task);
              }}
              className={`w-full flex justify-between items-center p-5 rounded-2xl border
                ${isDone ? "bg-green-50 border-green-400" : "bg-white"}`}
            >
              <span className="capitalize font-semibold">{task} brushing</span>

              <div className="flex items-center gap-3">
                <span className="text-sm">
                  {isRunning
                    ? formatTime(timeLeft)
                    : isDone
                    ? "Done"
                    : ""}
                </span>
                <span>🪥</span>
              </div>
            </button>
          );
        })}

        <button
          onClick={() => toggleTask("floss")}
          className={`w-full flex justify-between items-center p-5 rounded-2xl border
            ${todayData.floss ? "bg-green-50 border-green-400" : "bg-white"}`}
        >
          <span className="font-semibold">Floss / Water Pick</span>
          <div className="flex items-center gap-3">
            <span>{todayData.floss ? "Done" : ""}</span>
            <span>🧵</span>
          </div>
        </button>
      </section>
    </>
  );
}

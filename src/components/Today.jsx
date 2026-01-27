import { useEffect, useState } from "react";
import { getDateKey } from "../utils/date.js";
import { getYesterdayKey } from "../utils/streak.js";

const BRUSH_TIME = 120;
const RECOVERY_KEY = "__lastRecoveryUsed";

const REFLECTION_OPTIONS = [
  { id: "forgot", label: "I forgot", response: "Let’s add a reminder today." },
  { id: "tired", label: "I was too tired", response: "Try brushing a bit earlier tonight." },
  { id: "busy", label: "I was busy / away", response: "Short routines still count." },
  { id: "unmotivated", label: "I lacked motivation", response: "Momentum comes after action." },
  { id: "other", label: "Something else", response: "Progress isn’t linear — keep going." }
];

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

  // Timer toggle
  const [timerEnabled, setTimerEnabled] = useState(false);

  const submittedReflection = todayData.reflection;
  const shouldReflect = isRecoveryDay && !submittedReflection;

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

  const completedCount = Object.values(todayData).filter(Boolean).length;
  const percent = Math.round((completedCount / 3) * 100);

  const reflectionMeta = REFLECTION_OPTIONS.find(
    (o) => o.id === submittedReflection
  );

  return (
    <>
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

        {/* TIMER TOGGLE */}
        <div className="bg-white rounded-2xl p-4 border flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">
            Brushing timer
          </p>
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
            className={`px-4 py-2 rounded-full text-sm font-semibold transition
              ${timerEnabled ? "bg-cyan-500 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            {timerEnabled ? "Timer ON" : "Timer OFF"}
          </button>
        </div>

        {/* TASKS */}
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
              className={`w-full flex justify-between items-center p-5 rounded-2xl border transition-all
                ${
                  isDone
                    ? "bg-green-50 border-green-400"
                    : "bg-white border-gray-200 hover:scale-[1.02]"
                }`}
            >
              <span className="capitalize font-semibold">
                {task} brushing
              </span>
              <div className="flex items-center gap-3">
                {isRunning && (
                  <span className="font-mono text-sm text-cyan-600">
                    Timer active · {formatTime(timeLeft)}
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
          className={`w-full flex justify-between items-center p-5 rounded-2xl border
            ${
              todayData.floss
                ? "bg-green-50 border-green-400"
                : "bg-white border-gray-200"
            }`}
        >
          <span className="font-semibold">Floss</span>
          <span>{todayData.floss ? "✅" : "🧵"}</span>
        </button>

      </section>
    </>
  );
}

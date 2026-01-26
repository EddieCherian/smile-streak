import { useEffect, useState } from "react";
import { getDateKey } from "../utils/date.js";
import { getYesterdayKey } from "../utils/streak.js";

const BRUSH_TIME = 120; // seconds
const RECOVERY_KEY = "__lastRecoveryUsed";

/* 🧠 Reflection options */
const REFLECTION_OPTIONS = [
  { id: "forgot", label: "I forgot" },
  { id: "tired", label: "I was too tired" },
  { id: "busy", label: "I was busy / away" },
  { id: "lazy", label: "I didn’t feel motivated" },
  { id: "stressed", label: "I was stressed or overwhelmed" },
];

/* 💡 Reflection intelligence */
const REFLECTION_INSIGHTS = {
  forgot:
    "You tend to forget — choosing a consistent time usually helps.",
  tired:
    "Low energy nights are common — brushing earlier works better.",
  busy:
    "Busy days happen — recovery keeps consistency long-term.",
  lazy:
    "Motivation dips are normal — starting small breaks the cycle.",
  stressed:
    "Stress disrupts routines — protecting basics reduces overload.",
};

export default function Today({ habitData, setHabitData }) {
  const today = getDateKey();
  const yesterday = getYesterdayKey(today);

  const todayData = habitData[today] || {
    morning: false,
    night: false,
    floss: false,
  };

  const yesterdayData = habitData[yesterday];

  /* 🛟 Recovery availability (once per 7 days) */
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

  const [submittedReflection, setSubmittedReflection] = useState(
    habitData[today]?.reflection || null
  );

  const shouldReflect = isRecoveryDay && !submittedReflection;

  /* 🧠 Get most recent reflection */
  const getLastReflection = () =>
    Object.keys(habitData)
      .sort()
      .reverse()
      .map((day) => habitData[day]?.reflection)
      .find(Boolean);

  const lastReflection = getLastReflection();
  const insightMessage = lastReflection
    ? REFLECTION_INSIGHTS[lastReflection]
    : null;

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${(s % 60)
      .toString()
      .padStart(2, "0")}`;

  /* 🔁 Toggle task */
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

  /* ⏱️ Timer */
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
          <div className="bg-white px-8 py-6 rounded-3xl shadow-xl animate-pop">
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
        {/* 🧠 REFLECTION QUESTION */}
        {shouldReflect && (
          <div className="bg-white border border-cyan-200 rounded-2xl p-5 space-y-4">
            <p className="font-semibold">Quick check-in 🤔</p>
            <p className="text-sm text-gray-500">
              What caused you to miss yesterday?
            </p>

            {REFLECTION_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setHabitData((prev) => ({
                    ...prev,
                    [today]: {
                      ...todayData,
                      reflection: option.id,
                    },
                  }));
                  setSubmittedReflection(option.id);
                }}
                className="w-full text-left px-4 py-3 rounded-xl border hover:bg-cyan-50"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {/* 💡 INTELLIGENCE OUTPUT */}
        {insightMessage && (
          <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4">
            <p className="text-sm font-semibold text-cyan-700">
              Pattern Insight 💡
            </p>
            <p className="text-sm text-cyan-600">
              {insightMessage}
            </p>
          </div>
        )}

        {/* 🛟 RECOVERY BANNER */}
        {isRecoveryDay && (
          <div className="bg-orange-50 border border-orange-300 rounded-2xl p-4">
            <p className="font-semibold text-orange-600">
              Recovery Day 💪
            </p>
            <p className="text-sm text-orange-500">
              Recovery available once per week.
            </p>
          </div>
        )}

        {/* PROGRESS */}
        <div className="bg-white rounded-3xl p-6 shadow">
          <div className="h-4 bg-gray-200 rounded-full">
            <div
              className="h-full bg-cyan-500 rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-sm mt-2 text-gray-500">
            {percent}% completed
          </p>
        </div>
      </section>
    </>
  );
}

import { useEffect, useState } from "react";
import { getDateKey, getYesterdayKey } from "../utils/date.js";
import { calculateStreaks } from "../utils/streak.js";
import { Flame, Trophy, Clock, CheckCircle2, Circle, Sparkles } from "lucide-react";

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

  const recoveryAvailable = !lastRecoveryDate || lastRecoveryDate < oneWeekAgo;
  const missedYesterday = yesterdayData && ["morning", "night", "floss"].some((task) => yesterdayData[task] === false);
  const isRecoveryDay = missedYesterday && recoveryAvailable;

  const [activeTimer, setActiveTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(BRUSH_TIME);
  const [showStreak, setShowStreak] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [interdentalType, setInterdentalType] = useState("Floss");
  const [showMotivation, setShowMotivation] = useState(false);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    forceUpdate((v) => v + 1);
  }, [habitData]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const toggleTask = (task) => {
    const nextValue = !todayData[task];
    const completedNow = Object.values({ ...todayData, [task]: nextValue }).filter(Boolean).length;

    setHabitData((prev) => {
      const updated = {
        ...prev,
        [today]: { ...todayData, [task]: nextValue },
      };

      if (completedNow === 3 && isRecoveryDay) {
        updated[RECOVERY_KEY] = new Date().toISOString();
      }

      return updated;
    });

    if (completedNow === 3) {
      setShowStreak(true);
      setTimeout(() => setShowStreak(false), 2000);
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

  const completedCount = ["morning", "night", "floss"].filter((k) => todayData[k]).length;
  const percent = Math.round((completedCount / 3) * 100);
  const { current, longest } = calculateStreaks(habitData);

  // Motivational messages based on progress
  const getMotivationMessage = () => {
    if (completedCount === 0) return "Let's start your day right! 💪";
    if (completedCount === 1) return "Great start! Keep going! 🌟";
    if (completedCount === 2) return "Almost there! One more to go! 🎯";
    return "Perfect day! You're unstoppable! 🔥";
  };

  return (
    <>
      {/* Completion Celebration */}
      {showStreak && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-none animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white px-12 py-10 rounded-3xl shadow-2xl animate-[scaleBounce_0.6s_ease-out] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-400/20" />
            <div className="relative z-10 text-center">
              <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
              <p className="text-4xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Day Complete!
              </p>
              <p className="text-sm text-gray-600 mt-3">
                {isRecoveryDay ? "🎉 Recovery streak saved!" : "🔥 Perfect consistency!"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative rounded-3xl p-6 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white mb-6 shadow-xl overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src="/icon-511.png" alt="Smile Streak" className="h-16 w-16 rounded-2xl shadow-lg" />
                {completedCount === 3 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-black">Today's Routine</h1>
                <p className="text-sm opacity-90">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                <Flame className="w-5 h-5 text-orange-300 animate-pulse" />
                <p className="text-xs opacity-80 font-medium">Current Streak</p>
              </div>
              <p className="text-3xl font-black">{current}</p>
            </div>
          </div>

          {/* Motivation message */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
            <p className="text-sm font-medium">{getMotivationMessage()}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-4 text-center border border-blue-100 shadow-sm">
          <div className="flex justify-center mb-2">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-xs text-gray-500 mb-1">Current</p>
          <p className="text-2xl font-black text-gray-900">{current}</p>
        </div>
        
        <div className="bg-white rounded-2xl p-4 text-center border border-blue-100 shadow-sm">
          <div className="flex justify-center mb-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-xs text-gray-500 mb-1">Best</p>
          <p className="text-2xl font-black text-gray-900">{longest}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 text-center border border-blue-100 shadow-sm">
          <div className="flex justify-center mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 mb-1">Today</p>
          <p className="text-2xl font-black text-gray-900">{completedCount}/3</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-5 mb-6 border border-blue-100 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-semibold text-gray-700">Daily Progress</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimerEnabled((v) => {
                if (v && activeTimer) {
                  toggleTask(activeTimer);
                  setActiveTimer(null);
                  setTimeLeft(BRUSH_TIME);
                }
                return !v;
              })}
              className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                timerEnabled 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timer {timerEnabled ? "ON" : "OFF"}</span>
            </button>
          </div>
        </div>

        <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${
              percent === 100 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
            }`}
            style={{ width: `${percent}%` }}
          />
          {percent > 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow-md">{percent}%</span>
            </div>
          )}
        </div>

        {isRecoveryDay && (
          <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Recovery day available! Complete all tasks to restore your streak.
          </p>
        )}
      </div>

      {/* Task List */}
      <section className="space-y-3">
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
              className={`group w-full flex justify-between items-center p-5 rounded-2xl border-2 transition-all duration-200 ${
                isDone
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 shadow-sm"
                  : isRunning
                  ? "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-400 shadow-md scale-[1.02]"
                  : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.01]"
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300 group-hover:text-blue-400 transition-colors" />
                )}
                <div className="text-left">
                  <span className="capitalize font-bold text-gray-900 block">
                    {task} Brushing
                  </span>
                  {isRunning && (
                    <span className="text-xs text-blue-600 font-medium">Brush in circular motions...</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isRunning ? (
                  <div className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-lg font-bold text-sm animate-pulse">
                    <Clock className="w-4 h-4" />
                    {formatTime(timeLeft)}
                  </div>
                ) : isDone ? (
                  <span className="text-sm font-semibold text-green-600">Complete ✓</span>
                ) : null}
                <span className="text-2xl">🪥</span>
              </div>
            </button>
          );
        })}

        {/* Interdental Care */}
        <button
          onClick={() => toggleTask("floss")}
          className={`group w-full flex justify-between items-center p-5 rounded-2xl border-2 transition-all duration-200 ${
            todayData.floss
              ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 shadow-sm"
              : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.01]"
          }`}
        >
          <div className="flex items-center gap-3">
            {todayData.floss ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <Circle className="w-6 h-6 text-gray-300 group-hover:text-blue-400 transition-colors" />
            )}
            <div className="text-left">
              <span className="font-bold text-gray-900 block">Interdental Care</span>
              <select
                value={interdentalType}
                onChange={(e) => setInterdentalType(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="text-xs mt-1 border border-gray-300 rounded-lg px-2 py-1 bg-white hover:border-blue-400 transition-colors"
              >
                <option>Floss</option>
                <option>Water Pick</option>
                <option>Interdental Brush</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {todayData.floss && (
              <span className="text-sm font-semibold text-green-600">Complete ✓</span>
            )}
            <span className="text-2xl">🧵</span>
          </div>
        </button>
      </section>

      {/* Daily Tip */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm mb-1">Daily Tip</p>
            <p className="text-xs text-gray-600">
              {completedCount === 0 && "Start with your morning brush to set a positive tone for the day!"}
              {completedCount === 1 && "Don't forget to angle your brush at 45° towards the gum line."}
              {completedCount === 2 && "Great job! Remember to replace your toothbrush every 3 months."}
              {completedCount === 3 && "Perfect! Regular flossing reduces your risk of gum disease by 40%."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

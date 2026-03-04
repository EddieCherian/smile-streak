import { useEffect, useState, useContext, useRef } from "react";
import { getDateKey, getYesterdayKey } from "../utils/date.js";
import { calculateStreaks } from "../utils/streak.js";
import {
  Flame, Trophy, Clock, CheckCircle2, Circle, Sparkles,
  Target, Activity, Brush, Award, Share2,
  ChevronRight, Calendar, Zap, Star, Heart, Coffee,
  Moon, Sun, Droplets, Gift, Crown, Medal, Smile
} from "lucide-react";
import { TranslationContext } from "../App";

const BRUSH_TIME = 120;
const RECOVERY_KEY = "__lastRecoveryUsed";

export default function Today({ habitData, setHabitData, setActiveTab }) {
  const { t, currentLanguage } = useContext(TranslationContext);
  const [texts, setTexts] = useState({});
  const [consistencyScore, setConsistencyScore] = useState(0);
  const [streakMilestones, setStreakMilestones] = useState([]);
  const [streakMultiplier, setStreakMultiplier] = useState(1);
  const [badges, setBadges] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionText, setReflectionText] = useState("");
  const [showHydrationReminder, setShowHydrationReminder] = useState(false);
  const [waterIntake, setWaterIntake] = useState(0);
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [selectedTip, setSelectedTip] = useState(null);

  const today = getDateKey();
  const yesterday = getYesterdayKey(today);

  const todayData = habitData[today] || {
    morning: false,
    night: false,
    floss: false,
    reflection: null,
    mood: null,
    water: 0,
    notes: null
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
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [interdentalType, setInterdentalType] = useState("Floss");
  const [, forceUpdate] = useState(0);

  // Dental tips database
  const dentalTips = [
    { id: 1, title: "🪥 Proper Brushing", tip: "Brush for 2 minutes, spending 30 seconds in each quadrant. Use gentle circular motions, not back-and-forth sawing." },
    { id: 2, title: "🧵 Flossing Facts", tip: "Flossing removes plaque between teeth where your toothbrush can't reach. Do it before brushing for best results!" },
    { id: 3, title: "💧 Mouthwash Magic", tip: "Use mouthwash after brushing and flossing to rinse away loosened debris and reach areas you missed." },
    { id: 4, title: "🔄 Replace Your Brush", tip: "Change your toothbrush every 3-4 months or sooner if bristles are frayed. A worn brush cleans poorly!" },
    { id: 5, title: "🍎 Diet & Teeth", tip: "Crunchy fruits and veggies like apples and carrots help clean teeth naturally. Limit sugary snacks!" },
    { id: 6, title: "💧 Stay Hydrated", tip: "Drinking water helps wash away food particles and bacteria. It also prevents dry mouth, which can lead to cavities." },
    { id: 7, title: "⏰ Timing Matters", tip: "Wait 30 minutes after eating to brush. Acidic foods soften enamel, and brushing too soon can damage it." },
    { id: 8, title: "👅 Don't Forget Your Tongue", tip: "Brush your tongue gently to remove bacteria and freshen breath. A tongue scraper works great too!" },
  ];

  // Mood options
  const moodOptions = [
    { emoji: "😊", label: "Great", color: "green" },
    { emoji: "😐", label: "Okay", color: "yellow" },
    { emoji: "😴", label: "Tired", color: "blue" },
    { emoji: "😷", label: "Sick", color: "purple" },
    { emoji: "😌", label: "Relaxed", color: "indigo" },
    { emoji: "🤩", label: "Energetic", color: "orange" },
  ];

  useEffect(() => {
    forceUpdate((v) => v + 1);
  }, [habitData]);

  useEffect(() => {
    const translateAll = async () => {
      setTexts({
        dayComplete: await t("Day Complete!"),
        recoverySaved: await t("Recovery streak saved!"),
        perfectConsistency: await t("Perfect consistency!"),
        todaysRoutine: await t("Today's Routine"),
        currentStreak: await t("Current Streak"),
        current: await t("Current"),
        best: await t("Best"),
        today: await t("Today"),
        dailyProgress: await t("Daily Progress"),
        timer: await t("Timer"),
        on: await t("ON"),
        off: await t("OFF"),
        recoveryAvailable: await t("Recovery day available! Complete all tasks to restore your streak."),
        morningBrushing: await t("Morning Brushing"),
        nightBrushing: await t("Night Brushing"),
        brushCircular: await t("Brush in circular motions..."),
        complete: await t("Complete"),
        interdentalCare: await t("Interdental Care"),
        floss: await t("Floss"),
        waterPick: await t("Water Pick"),
        interdentalBrush: await t("Interdental Brush"),
        dailyTip: await t("Daily Tip"),
        tip0: await t("Start with your morning brush to set a positive tone for the day!"),
        tip1: await t("Don't forget to angle your brush at 45° towards the gum line."),
        tip2: await t("Great job! Remember to replace your toothbrush every 3 months."),
        tip3: await t("Perfect! Regular flossing reduces your risk of gum disease by 40%."),
        motivate0: await t("Let's start your day right! 💪"),
        motivate1: await t("Great start! Keep going! 🌟"),
        motivate2: await t("Almost there! One more to go! 🎯"),
        motivate3: await t("Perfect day! You're unstoppable! 🔥"),
        consistencyScore: await t("Consistency Score"),
        streakMultiplier: await t("Streak Multiplier"),
        nextMilestone: await t("Next Milestone"),
        daysRemaining: await t("days remaining"),
        howYouFeel: await t("How do you feel today?"),
        waterIntake: await t("Water Intake"),
        cups: await t("cups"),
        addNote: await t("Add a note..."),
        saveReflection: await t("Save Reflection"),
        dailyReflection: await t("Daily Reflection"),
        dentalTip: await t("Dental Tip"),
        viewMoreTips: await t("View More Tips"),
      });
    };
    translateAll();
  }, [currentLanguage, t]);

  // Calculate stats
  useEffect(() => {
    const weekData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = getDateKey(date);
      const day = habitData[dateKey];
      if (day) {
        const completed = ["morning", "night", "floss"].filter(k => day[k]).length;
        weekData.push(completed / 3);
      }
    }
    const avg = weekData.reduce((a, b) => a + b, 0) / 7 * 100;
    setConsistencyScore(Math.round(avg) || 0);
    
    const { current, longest } = calculateStreaks(habitData);
    
    if (current >= 30) setStreakMultiplier(2);
    else if (current >= 14) setStreakMultiplier(1.5);
    else if (current >= 7) setStreakMultiplier(1.25);
    else setStreakMultiplier(1);
    
    const newBadges = [];
    if (longest >= 7) newBadges.push({ name: 'Week Warrior', emoji: '🛡️' });
    if (longest >= 30) newBadges.push({ name: 'Monthly Master', emoji: '👑' });
    if (longest >= 100) newBadges.push({ name: 'Century Club', emoji: '🏆' });
    
    let perfectWeek = true;
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = getDateKey(date);
      const day = habitData[dateKey];
      if (!day || !day.morning || !day.night || !day.floss) {
        perfectWeek = false;
        break;
      }
    }
    if (perfectWeek) newBadges.push({ name: 'Perfect Week', emoji: '✨' });
    
    // Check for perfect month (30 days)
    let perfectMonth = true;
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = getDateKey(date);
      const day = habitData[dateKey];
      if (!day || !day.morning || !day.night || !day.floss) {
        perfectMonth = false;
        break;
      }
    }
    if (perfectMonth) newBadges.push({ name: 'Perfect Month', emoji: '🌟' });
    
    setBadges(newBadges);
    
    const milestones = [7, 30, 60, 90, 180, 365];
    const next = milestones.find(m => m > current) || 365;
    setStreakMilestones([{ current, next, remaining: next - current }]);
    
    // Set water intake from saved data
    setWaterIntake(todayData.water || 0);
    setCurrentMood(todayData.mood || null);
    setReflectionText(todayData.reflection || "");
    
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
      setShowCompletion(true);
      setTimeout(() => setShowCompletion(false), 2500);
    }
  };

  const saveReflection = () => {
    setHabitData((prev) => ({
      ...prev,
      [today]: { ...todayData, reflection: reflectionText, mood: currentMood, water: waterIntake },
    }));
    setShowReflection(false);
  };

  const incrementWater = () => {
    const newWater = waterIntake + 1;
    setWaterIntake(newWater);
    setHabitData((prev) => ({
      ...prev,
      [today]: { ...todayData, water: newWater },
    }));
  };

  const decrementWater = () => {
    if (waterIntake > 0) {
      const newWater = waterIntake - 1;
      setWaterIntake(newWater);
      setHabitData((prev) => ({
        ...prev,
        [today]: { ...todayData, water: newWater },
      }));
    }
  };

  const setMood = (mood) => {
    setCurrentMood(mood);
    setHabitData((prev) => ({
      ...prev,
      [today]: { ...todayData, mood },
    }));
    setShowMoodTracker(false);
  };

  const timerIntervalRef = useRef(null);

  const toggleTimer = () => {
    if (timerEnabled && activeTimer) {
      toggleTask(activeTimer);
      clearInterval(timerIntervalRef.current);
      setActiveTimer(null);
      setTimeLeft(BRUSH_TIME);
    }
    setTimerEnabled(!timerEnabled);
  };

  useEffect(() => {
    if (!activeTimer) return;
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerIntervalRef.current);
          toggleTask(activeTimer);
          setActiveTimer(null);
          return BRUSH_TIME;
        }
        return t - 1;
      });
    }, 1000);

    return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
  }, [activeTimer]);

  const completedCount = ["morning", "night", "floss"].filter((k) => todayData[k]).length;
  const percent = Math.round((completedCount / 3) * 100);
  const { current, longest } = calculateStreaks(habitData);

  const dayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const tipText = [
    "Start with your morning brush to set a positive tone for the day!",
    "Angle your brush at 45° towards the gum line for deeper clean.",
    "Great job! Replace your toothbrush every 3 months.",
    "Perfect! Regular flossing reduces gum disease risk by 40%.",
  ][completedCount];

  // Random tip of the day
  const tipOfTheDay = dentalTips[new Date().getDate() % dentalTips.length];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .animate-fadeIn { animation: fadeIn 0.3s ease; }
        .animate-slideUp { animation: slideUp 0.4s ease; }
        .animate-scaleIn { animation: scaleIn 0.3s ease; }
        .animate-pulse { animation: pulse 2s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* Completion Celebration */}
      {showCompletion && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl px-8 py-6 shadow-xl border border-blue-100 animate-scaleIn">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-float">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-semibold text-gray-900 mb-1">
                {texts.dayComplete || "Day Complete!"} 🎉
              </p>
              <p className="text-sm text-gray-500">
                {isRecoveryDay ? "🔄 Recovery streak saved!" : "✨ Perfect consistency!"}
              </p>
              {streakMultiplier > 1 && (
                <p className="text-xs text-blue-600 mt-2 font-medium">
                  ⚡ {streakMultiplier}x Multiplier Active
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">✨ Today's Routine</h1>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {dayLabel}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowReflection(true)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Add reflection"
              >
                <Heart className="w-4 h-4" />
              </button>
              <button
                onClick={toggleTimer}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  timerEnabled 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-sm' 
                    : 'bg-white border border-blue-200 text-gray-600 hover:bg-blue-50'
                }`}
              >
                <Clock className="w-4 h-4" />
                {timerEnabled ? '⏸️ ON' : '⏯️ OFF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Motivation Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl p-4 text-white shadow-sm">
          <p className="text-sm flex items-center gap-2">
            <span className="text-xl">
              {completedCount === 0 && "🌅"}
              {completedCount === 1 && "🌟"}
              {completedCount === 2 && "🎯"}
              {completedCount === 3 && "🏆"}
            </span>
            <span className="font-medium">
              {completedCount === 0 && "Let's start your day right!"}
              {completedCount === 1 && "Great start — keep going!"}
              {completedCount === 2 && "Almost there, one more to go!"}
              {completedCount === 3 && "Perfect day! You're unstoppable!"}
            </span>
          </p>
        </div>

        {/* Progress Stats */}
        <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-6">
            {/* Circular Progress */}
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="#e0f2fe"
                  strokeWidth="6"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - percent / 100)}`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-semibold text-gray-900">{percent}%</span>
                <span className="text-[10px] text-gray-500">done</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="flex-1 grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-lg font-semibold text-gray-900">
                  <Flame className="w-4 h-4 text-orange-500" /> {current}
                </div>
                <div className="text-xs text-gray-500">streak</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-lg font-semibold text-gray-900">
                  <Trophy className="w-4 h-4 text-yellow-500" /> {longest}
                </div>
                <div className="text-xs text-gray-500">best</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-lg font-semibold text-gray-900">
                  <Target className="w-4 h-4 text-blue-500" /> {consistencyScore}%
                </div>
                <div className="text-xs text-gray-500">score</div>
              </div>
            </div>
          </div>

          {/* Streak Multiplier */}
          {streakMultiplier > 1 && (
            <div className="mt-3 pt-3 border-t border-blue-100 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-medium text-gray-700">{streakMultiplier}x Streak Multiplier Active</span>
            </div>
          )}
        </div>

        {/* Recovery Notice */}
        {isRecoveryDay && (
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
            <p className="text-xs text-amber-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              🔄 Recovery day — complete all tasks to restore your streak.
            </p>
          </div>
        )}

        {/* Tasks */}
        <div className="space-y-2">
          {/* Morning & Night */}
          {["morning", "night"].map((task) => {
            const isDone = todayData[task];
            const isRunning = activeTimer === task;
            
            return (
              <button
                key={task}
                onClick={() => {
                  if (isDone) {
                    toggleTask(task);
                  } else if (timerEnabled && !isDone) {
                    setActiveTimer(task);
                    setTimeLeft(BRUSH_TIME);
                  } else {
                    toggleTask(task);
                  }
                }}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isDone
                    ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'
                    : isRunning
                    ? 'bg-white border-blue-300 shadow-md'
                    : 'bg-white border-blue-100 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{task === 'morning' ? '🌅' : '🌙'}</span>
                  <div className="text-left">
                    <span className="font-medium text-gray-900">
                      {task === 'morning' ? 'Morning Brushing' : 'Night Brushing'}
                    </span>
                    <span className="text-xs text-gray-500 block mt-0.5">
                      {isRunning ? '🔄 Brush in circular motions...' : isDone ? '✅ Completed' : '⏱️ 2 minutes'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isRunning ? (
                    <div className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-sm">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {formatTime(timeLeft)}
                    </div>
                  ) : isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
              </button>
            );
          })}

          {/* Interdental Care */}
          <button
            onClick={() => toggleTask("floss")}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
              todayData.floss
                ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'
                : 'bg-white border-blue-100 hover:border-blue-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧵</span>
              <div className="text-left">
                <span className="font-medium text-gray-900">Interdental Care</span>
                <select
                  value={interdentalType}
                  onChange={(e) => setInterdentalType(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-gray-500 bg-transparent border-none focus:outline-none focus:ring-0 p-0 mt-0.5 block cursor-pointer"
                >
                  <option>🪥 Floss</option>
                  <option>💧 Water Pick</option>
                  <option>🪒 Interdental Brush</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {todayData.floss ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300" />
              )}
            </div>
          </button>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Water Intake */}
          <div className="bg-white rounded-xl p-3 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Droplets className="w-3 h-3 text-blue-500" /> Water
              </span>
              <span className="text-sm font-semibold text-gray-900">{waterIntake} 💧</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={decrementWater}
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200"
              >
                -
              </button>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (waterIntake / 8) * 100)}%` }}
                />
              </div>
              <button
                onClick={incrementWater}
                className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600"
              >
                +
              </button>
            </div>
          </div>

          {/* Mood Tracker */}
          <div className="bg-white rounded-xl p-3 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Smile className="w-3 h-3 text-yellow-500" /> Mood
              </span>
              {currentMood && (
                <span className="text-sm">{moodOptions.find(m => m.label === currentMood)?.emoji}</span>
              )}
            </div>
            <button
              onClick={() => setShowMoodTracker(true)}
              className="w-full py-2 bg-gray-50 rounded-lg text-xs text-gray-600 hover:bg-gray-100 flex items-center justify-center gap-1"
            >
              {currentMood ? '😊 Change mood' : '➕ How do you feel?'}
            </button>
          </div>
        </div>

        {/* Next Milestone */}
        {streakMilestones.length > 0 && streakMilestones[0].remaining > 0 && (
          <div className="bg-white rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3 h-3 text-yellow-500" /> Next Milestone
              </span>
              <span className="text-xs text-gray-500">{current} → {streakMilestones[0].next} days</span>
            </div>
            <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (current / streakMilestones[0].next) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{streakMilestones[0].remaining} days remaining</p>
          </div>
        )}

        {/* Daily Tip - Featured */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl p-4 text-white shadow-sm">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/80 uppercase tracking-wider mb-1">✨ Tip of the Day</p>
              <p className="text-sm text-white font-medium">{tipOfTheDay.tip}</p>
              <p className="text-xs text-white/70 mt-1">— {tipOfTheDay.title}</p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        {badges.length > 0 && (
          <div className="bg-white rounded-xl p-4 border border-blue-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
              <Award className="w-3 h-3 text-yellow-500" /> Achievements
            </p>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-white text-gray-700 rounded-lg text-xs border border-blue-100"
                >
                  <span className="text-blue-500">{badge.emoji}</span>
                  {badge.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reflection Note */}
        {reflectionText && (
          <div className="bg-white rounded-xl p-4 border border-blue-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-400" /> Today's Note
            </p>
            <p className="text-sm text-gray-600 italic">"{reflectionText}"</p>
          </div>
        )}

        {/* Share Button */}
        <button
          onClick={() => setShowShareModal(true)}
          className="w-full py-3 bg-white border border-blue-200 rounded-xl text-sm text-gray-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4 text-blue-500" />
          Share your progress 📤
        </button>
      </div>

      {/* Reflection Modal */}
      {showReflection && (
        <div
          className="fixed inset-0 bg-black/20 flex items-end sm:items-center justify-center z-50 animate-fadeIn"
          onClick={() => setShowReflection(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden" />
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" /> Daily Reflection
            </h3>
            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="How was your day? Any thoughts about your dental routine?..."
              className="w-full p-3 border border-blue-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={saveReflection}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-xl text-sm font-medium hover:shadow-md transition-all"
              >
                💾 Save Reflection
              </button>
              <button
                onClick={() => setShowReflection(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mood Tracker Modal */}
      {showMoodTracker && (
        <div
          className="fixed inset-0 bg-black/20 flex items-end sm:items-center justify-center z-50 animate-fadeIn"
          onClick={() => setShowMoodTracker(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden" />
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How are you feeling today?</h3>
            <div className="grid grid-cols-3 gap-2">
              {moodOptions.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setMood(mood.label)}
                  className={`p-3 rounded-xl border transition-all ${
                    currentMood === mood.label
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className="text-xs text-gray-600">{mood.label}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowMoodTracker(false)}
              className="w-full mt-4 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/20 flex items-end sm:items-center justify-center z-50 animate-fadeIn"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden" />
            <h3 className="text-lg font-semibold text-gray-900 mb-4">✨ Share Your Progress</h3>
            <div className="space-y-2">
              <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-xl text-sm font-medium hover:shadow-md transition-all flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Share with friends
              </button>
              <button className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <Award className="w-4 h-4" />
                Share achievement
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 py-3 text-sm text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
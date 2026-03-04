import { useEffect, useState, useContext, useRef } from "react";
import { getDateKey, getYesterdayKey } from "../utils/date.js";
import { calculateStreaks } from "../utils/streak.js";
import { 
  Flame, Trophy, Clock, CheckCircle2, Circle, Sparkles, 
  Calendar, Target, TrendingUp, Award, Zap, Activity,
  ChevronRight, BarChart3, Share2, Bell, Wind, Home,
  User, Settings, Info, Moon, Sun, Droplets, Brush
} from "lucide-react";
import { TranslationContext, ThemeContext } from "../App";

const BRUSH_TIME = 120;
const RECOVERY_KEY = "__lastRecoveryUsed";

export default function Today({ habitData, setHabitData, setActiveTab }) {
  const { t, currentLanguage } = useContext(TranslationContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [texts, setTexts] = useState({});
  const [showInsights, setShowInsights] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [streakFreeze, setStreakFreeze] = useState(false);
  const [consistencyScore, setConsistencyScore] = useState(0);
  const [hoveredTask, setHoveredTask] = useState(null);
  const [touchRipple, setTouchRipple] = useState({ active: false, x: 0, y: 0 });
  const [streakMilestones, setStreakMilestones] = useState([]);
  const [streakMultiplier, setStreakMultiplier] = useState(1);
  const [badges, setBadges] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);

  const today = getDateKey();
  const yesterday = getYesterdayKey(today);

  const todayData = habitData[today] || {
    morning: false,
    night: false,
    floss: false,
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
        insights: await t("Insights"),
        achievements: await t("Achievements"),
        reminders: await t("Reminders"),
        shareProgress: await t("Share Progress"),
        consistencyScore: await t("Consistency Score"),
        streakMultiplier: await t("Streak Multiplier"),
        nextMilestone: await t("Next Milestone"),
        daysRemaining: await t("days remaining"),
      });
    };
    translateAll();
  }, [currentLanguage, t]);

  // Calculate stats
  useEffect(() => {
    // Calculate consistency score
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
    
    // Set streak multiplier
    const { current } = calculateStreaks(habitData);
    if (current >= 30) setStreakMultiplier(2);
    else if (current >= 14) setStreakMultiplier(1.5);
    else if (current >= 7) setStreakMultiplier(1.25);
    else setStreakMultiplier(1);
    
    // Generate badges
    const newBadges = [];
    const { longest } = calculateStreaks(habitData);
    if (longest >= 7) newBadges.push('Week Warrior');
    if (longest >= 30) newBadges.push('Monthly Master');
    if (longest >= 100) newBadges.push('Century Club');
    
    // Check for perfect week
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
    if (perfectWeek) newBadges.push('Perfect Week');
    
    setBadges(newBadges);
    
    // Set streak milestones
    const milestones = [7, 30, 60, 90, 180, 365];
    const next = milestones.find(m => m > current) || 365;
    setStreakMilestones([{ current, next, remaining: next - current }]);
    
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

    // Show completion only when ALL THREE tasks are done
    if (completedNow === 3) {
      setShowCompletion(true);
      setTimeout(() => setShowCompletion(false), 2000);
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

  const getMotivationMessage = () => {
    if (completedCount === 0) return texts.motivate0 || "Let's start your day right! 💪";
    if (completedCount === 1) return texts.motivate1 || "Great start! Keep going! 🌟";
    if (completedCount === 2) return texts.motivate2 || "Almost there! One more to go! 🎯";
    return texts.motivate3 || "Perfect day! You're unstoppable! 🔥";
  };

  const handleTouchStart = (e, task) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    setTouchRipple({ active: true, x, y });
    setTimeout(() => setTouchRipple({ active: false, x: 0, y: 0 }), 500);
  };

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
    }`}>
      
      {/* Completion Celebration - Only shows when ALL tasks are done */}
      {showCompletion && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl px-8 py-6 shadow-2xl animate-scaleUp">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {texts.dayComplete || "Day Complete!"}
              </p>
              <p className="text-sm text-gray-600">
                {isRecoveryDay ? "Recovery streak saved!" : "Perfect consistency!"}
              </p>
              {streakMultiplier > 1 && (
                <p className="text-xs text-blue-600 mt-2 font-medium">
                  {streakMultiplier}x Streak Multiplier Active!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-blue-100 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-400 rounded-lg flex items-center justify-center">
              <Brush className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Today's Routine</h1>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-gray-600" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* Stats Cards - Clean white with light blue accents */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3 text-center border border-blue-100 shadow-sm">
            <Flame className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Current</p>
            <p className="text-lg font-semibold text-gray-900">{current}</p>
          </div>
          
          <div className="bg-white rounded-xl p-3 text-center border border-blue-100 shadow-sm">
            <Trophy className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Best</p>
            <p className="text-lg font-semibold text-gray-900">{longest}</p>
          </div>

          <div className="bg-white rounded-xl p-3 text-center border border-blue-100 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Today</p>
            <p className="text-lg font-semibold text-gray-900">{completedCount}/3</p>
          </div>

          <div className="bg-white rounded-xl p-3 text-center border border-blue-100 shadow-sm">
            <Target className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Score</p>
            <p className="text-lg font-semibold text-gray-900">{consistencyScore}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Daily Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-blue-600">{percent}%</span>
              <button
                onClick={() => setTimerEnabled(!timerEnabled)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  timerEnabled 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-3 h-3 inline mr-1" />
                {timerEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          {isRecoveryDay && (
            <div className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs text-amber-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Recovery day! Complete all tasks to restore streak.
              </p>
            </div>
          )}

          {streakMilestones.length > 0 && streakMilestones[0].remaining > 0 && (
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-gray-500">Next: {streakMilestones[0].next} days</span>
              <span className="text-blue-600 font-medium">{streakMilestones[0].remaining} days left</span>
            </div>
          )}
        </div>

        {/* Task List - Clean and simple */}
        <div className="space-y-3">
          {["morning", "night"].map((task) => {
            const isDone = todayData[task];
            const isRunning = activeTimer === task;
            const isHovered = hoveredTask === task;

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
                onMouseEnter={() => setHoveredTask(task)}
                onMouseLeave={() => setHoveredTask(null)}
                onTouchStart={(e) => handleTouchStart(e, task)}
                className={`relative w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  isDone
                    ? 'bg-green-50 border-green-200'
                    : isRunning
                    ? 'bg-blue-50 border-blue-300 shadow-md'
                    : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className={`w-6 h-6 transition-colors ${
                      isHovered ? 'text-blue-400' : 'text-gray-300'
                    }`} />
                  )}
                  <div className="text-left">
                    <span className="font-medium text-gray-900">
                      {task === "morning" ? "Morning Brushing" : "Night Brushing"}
                    </span>
                    {isRunning && (
                      <span className="text-xs text-blue-600 block">Brush in circular motions...</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isRunning ? (
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {formatTime(timeLeft)}
                    </div>
                  ) : isDone ? (
                    <span className="text-sm text-green-600">Complete ✓</span>
                  ) : (
                    <span className="text-sm text-gray-400 group-hover:text-blue-500 transition-colors">
                      Start
                    </span>
                  )}
                  <span className="text-2xl">{task === "morning" ? "☀️" : "🌙"}</span>
                </div>
              </button>
            );
          })}

          {/* Interdental Care */}
          <button
            onClick={() => toggleTask("floss")}
            className={`relative w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              todayData.floss
                ? 'bg-green-50 border-green-200'
                : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-3">
              {todayData.floss ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300" />
              )}
              <div className="text-left">
                <span className="font-medium text-gray-900 block">Interdental Care</span>
                <select
                  value={interdentalType}
                  onChange={(e) => setInterdentalType(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs mt-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-blue-300"
                >
                  <option>Floss</option>
                  <option>Water Pick</option>
                  <option>Interdental Brush</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {todayData.floss && (
                <span className="text-sm text-green-600">Complete ✓</span>
              )}
              <span className="text-2xl">🧵</span>
            </div>
          </button>
        </div>

        {/* Daily Tip */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-xl p-4 border border-blue-100">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm mb-1">Daily Tip</p>
              <p className="text-xs text-gray-600">
                {completedCount === 0 && "Start with your morning brush to set a positive tone for the day!"}
                {completedCount === 1 && "Don't forget to angle your brush at 45° towards the gum line."}
                {completedCount === 2 && "Great job! Remember to replace your toothbrush every 3 months."}
                {completedCount === 3 && "Perfect! Regular flossing reduces your risk of gum disease by 40%."}
              </p>
            </div>
          </div>
        </div>

        {/* Achievements Preview */}
        {badges.length > 0 && (
          <div className="bg-white rounded-xl p-4 border border-blue-100">
            <p className="text-sm font-medium text-gray-700 mb-2">Your Achievements</p>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, i) => (
                <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                  🏆 {badge}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation - Clean and functional */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 px-4 py-2">
        <div className="max-w-3xl mx-auto flex justify-around items-center">
          <button
            onClick={() => setActiveTab('home')}
            className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </button>

          <button
            onClick={() => setShowInsights(!showInsights)}
            className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs mt-1">Insights</span>
          </button>

          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600 transition-colors relative"
          >
            <Award className="w-5 h-5" />
            <span className="text-xs mt-1">Achievements</span>
            {badges.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-[10px] text-white flex items-center justify-center">
                {badges.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowReminders(!showReminders)}
            className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="text-xs mt-1">Reminders</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-xs mt-1">Share</span>
          </button>
        </div>
      </nav>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Share Your Progress</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Download className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">Save as Image</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Share2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">Share with Friends</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">Export Data</span>
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
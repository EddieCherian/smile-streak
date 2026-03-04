import { useEffect, useState, useContext, useRef } from "react";
import { getDateKey, getYesterdayKey } from "../utils/date.js";
import { calculateStreaks } from "../utils/streak.js";
import { 
  Flame, Trophy, Clock, CheckCircle2, Circle, Sparkles, 
  Calendar, Target, TrendingUp, Award, Zap, Heart,
  Coffee, Moon, Sun, Droplets, Activity, Smile, Bell,
  ChevronRight, AlertCircle, Info, X, Play, Pause,
  SkipForward, RefreshCw, Star, Gift, Crown, Medal,
  BarChart3, PieChart, Download, Share2, Mic, Volume2,
  Brain, Shield, Lock, Unlock, Eye, EyeOff, BookOpen,
  FileText, MessageCircle, ThumbsUp, Gift as GiftIcon,
  Wind, Battery, BatteryCharging, BatteryFull, Watch,
  Music, Headphones, Calendar as CalendarIcon
} from "lucide-react";
import { TranslationContext, ThemeContext } from "../App";

const BRUSH_TIME = 120;
const RECOVERY_KEY = "__lastRecoveryUsed";

export default function Today({ habitData, setHabitData }) {
  const { t, currentLanguage } = useContext(TranslationContext);
  const { darkMode } = useContext(ThemeContext);
  const [texts, setTexts] = useState({});
  const [showCompletionCelebration, setShowCompletionCelebration] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [streakFreeze, setStreakFreeze] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [brushQuality, setBrushQuality] = useState(null);
  const [streakMilestones, setStreakMilestones] = useState([]);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [breathingExercise, setBreathingExercise] = useState(false);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [breathCount, setBreathCount] = useState(4);
  const [showSoundOptions, setShowSoundOptions] = useState(false);
  const [selectedSound, setSelectedSound] = useState('waves');
  const [isPlaying, setIsPlaying] = useState(false);
  const [brushStreak, setBrushStreak] = useState(0);
  const [flossStreak, setFlossStreak] = useState(0);
  const [consistencyScore, setConsistencyScore] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [hoveredTask, setHoveredTask] = useState(null);
  const [touchRipple, setTouchRipple] = useState({ active: false, x: 0, y: 0 });
  
  const audioRef = useRef(null);
  const canvasRef = useRef(null);

  const today = getDateKey();
  const yesterday = getYesterdayKey(today);

  const todayData = habitData[today] || {
    morning: false,
    night: false,
    floss: false,
    reflection: null,
    mood: null,
    notes: null,
    duration: {},
    quality: {}
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
  const [streakFreezeAvailable, setStreakFreezeAvailable] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(100);
  const [streakMultiplier, setStreakMultiplier] = useState(1);
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathingStep, setBreathingStep] = useState(0);
  const [badges, setBadges] = useState([]);

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
        
        // New translations
        insights: await t("Insights"),
        achievements: await t("Achievements"),
        reminders: await t("Reminders"),
        shareProgress: await t("Share Progress"),
        focusMode: await t("Focus Mode"),
        streakFreeze: await t("Streak Freeze Available"),
        brushQuality: await t("Brush Quality"),
        consistencyScore: await t("Consistency Score"),
        weeklyGoal: await t("Weekly Goal"),
        streakMultiplier: await t("Streak Multiplier"),
        soundOptions: await t("Sound Options"),
        breathingExercise: await t("Breathing Exercise"),
        statistics: await t("Statistics"),
        achievementsUnlocked: await t("Achievements Unlocked"),
        nextMilestone: await t("Next Milestone"),
        daysRemaining: await t("days remaining"),
        perfectWeek: await t("Perfect Week"),
        perfectMonth: await t("Perfect Month"),
        earlyBird: await t("Early Bird"),
        nightOwl: await t("Night Owl"),
        flossKing: await t("Floss King"),
        streakMaster: await t("Streak Master"),
        consistencyChampion: await t("Consistency Champion")
      });
    };
    translateAll();
  }, [currentLanguage, t]);

  // Calculate additional stats
  useEffect(() => {
    // Calculate brush streak (morning + night)
    const brushOnly = ["morning", "night"].filter(k => todayData[k]).length;
    setBrushStreak(brushOnly);
    
    // Calculate floss streak
    setFlossStreak(todayData.floss ? 1 : 0);
    
    // Calculate consistency score (0-100)
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
    
    // Set streak multiplier based on current streak
    const { current } = calculateStreaks(habitData);
    if (current >= 30) setStreakMultiplier(2);
    else if (current >= 14) setStreakMultiplier(1.5);
    else if (current >= 7) setStreakMultiplier(1.25);
    else setStreakMultiplier(1);
    
    // Check for streak freeze availability
    const streakFreezeItem = localStorage.getItem('streakFreeze');
    setStreakFreezeAvailable(streakFreezeItem === 'true');
    
    // Generate badges
    const newBadges = [];
    const { longest } = calculateStreaks(habitData);
    if (longest >= 7) newBadges.push({ name: 'Week Warrior', icon: <Medal className="w-4 h-4" />, color: 'bronze' });
    if (longest >= 30) newBadges.push({ name: 'Monthly Master', icon: <Crown className="w-4 h-4" />, color: 'silver' });
    if (longest >= 100) newBadges.push({ name: 'Century Club', icon: <Award className="w-4 h-4" />, color: 'gold' });
    
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
    if (perfectWeek) newBadges.push({ name: 'Perfect Week', icon: <Star className="w-4 h-4" />, color: 'purple' });
    
    setBadges(newBadges);
    
    // Set streak milestones
    const milestones = [7, 30, 60, 90, 180, 365];
    const next = milestones.find(m => m > current) || 365;
    setStreakMilestones([{ current, next, remaining: next - current }]);
    
  }, [habitData, todayData]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const toggleTask = (task) => {
    const nextValue = !todayData[task];
    const completedNow = Object.values({ ...todayData, [task]: nextValue }).filter(Boolean).length;

    setHabitData((prev) => {
      const updated = {
        ...prev,
        [today]: { 
          ...todayData, 
          [task]: nextValue,
          duration: { ...todayData.duration, [task]: activeTimer ? BRUSH_TIME - timeLeft : null },
          quality: { ...todayData.quality, [task]: brushQuality }
        },
      };

      if (completedNow === 3 && isRecoveryDay) {
        updated[RECOVERY_KEY] = new Date().toISOString();
      }

      return updated;
    });

    if (completedNow === 3) {
      setShowStreak(true);
      setShowConfetti(true);
      setTimeout(() => {
        setShowStreak(false);
        setShowConfetti(false);
      }, 2000);
    }
    
    setSelectedTask(null);
    setBrushQuality(null);
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

  // Breathing exercise
  const startBreathing = () => {
    setBreathingExercise(true);
    setBreathPhase('inhale');
    setBreathCount(4);
    
    const interval = setInterval(() => {
      setBreathCount((c) => {
        if (c <= 1) {
          setBreathPhase((p) => {
            if (p === 'inhale') return 'hold';
            if (p === 'hold') return 'exhale';
            return 'inhale';
          });
          return p === 'exhale' ? 4 : 4;
        }
        return c - 1;
      });
    }, 1000);
    
    setTimeout(() => {
      clearInterval(interval);
      setBreathingExercise(false);
    }, 30000);
  };

  // Handle touch ripple effect
  const handleTouchStart = (e, task) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    setTouchRipple({ active: true, x, y });
    setTimeout(() => setTouchRipple({ active: false, x: 0, y: 0 }), 500);
  };

  return (
    <div className={`min-h-screen p-4 pb-24 transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
    }`}>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                background: `hsl(${Math.random() * 360}, 70%, 50%)`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Completion Celebration */}
      {showStreak && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-none animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white dark:bg-gray-800 px-12 py-10 rounded-3xl shadow-2xl animate-[scaleBounce_0.6s_ease-out] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-400/20 dark:from-green-400/10 dark:to-blue-400/10" />
            <div className="relative z-10 text-center">
              <div className="relative">
                <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
                {streakMultiplier > 1 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {streakMultiplier}x
                  </div>
                )}
              </div>
              <p className="text-4xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent dark:from-green-400 dark:to-blue-400">
                {texts.dayComplete || "Day Complete!"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
                {isRecoveryDay ? `🎉 ${texts.recoverySaved || "Recovery streak saved!"}` : `🔥 ${texts.perfectConsistency || "Perfect consistency!"}`}
              </p>
              {streakMultiplier > 1 && (
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 font-semibold">
                  {streakMultiplier}x Streak Multiplier Active!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative rounded-3xl p-6 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white mb-6 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <img src="/icon-511.png" alt="Smile Streak" className="h-16 w-16 rounded-2xl shadow-lg ring-4 ring-white/20 transition-transform group-hover:scale-110" />
                {completedCount === 3 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
                {streakMultiplier > 1 && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-black flex items-center gap-2">
                  {texts.todaysRoutine || "Today's Routine"}
                  {streakFreezeAvailable && (
                    <span className="text-xs bg-blue-400/30 px-2 py-1 rounded-full flex items-center gap-1">
                      <Snowflake className="w-3 h-3" /> Freeze
                    </span>
                  )}
                </h1>
                <p className="text-sm opacity-90 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                <Flame className="w-5 h-5 text-orange-300 animate-pulse" />
                <p className="text-xs opacity-80 font-medium">{texts.currentStreak || "Current Streak"}</p>
              </div>
              <p className="text-3xl font-black flex items-center gap-2">
                {current}
                {streakMultiplier > 1 && (
                  <span className="text-sm bg-yellow-400/30 px-2 py-1 rounded-full">
                    {streakMultiplier}x
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer" />
            <p className="text-sm font-medium flex items-center justify-center gap-2">
              {getMotivationMessage()}
              {completedCount === 2 && (
                <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid with Enhanced Visuals */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-blue-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all hover:scale-105">
          <div className="flex justify-center mb-1">
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{texts.current || "Current"}</p>
          <p className="text-lg font-black text-gray-900 dark:text-white">{current}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-blue-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all hover:scale-105">
          <div className="flex justify-center mb-1">
            <Trophy className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{texts.best || "Best"}</p>
          <p className="text-lg font-black text-gray-900 dark:text-white">{longest}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-blue-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all hover:scale-105">
          <div className="flex justify-center mb-1">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{texts.today || "Today"}</p>
          <p className="text-lg font-black text-gray-900 dark:text-white">{completedCount}/3</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-blue-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all hover:scale-105">
          <div className="flex justify-center mb-1">
            <Target className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Score</p>
          <p className="text-lg font-black text-gray-900 dark:text-white">{consistencyScore}%</p>
        </div>
      </div>

      {/* Enhanced Progress Bar with Streak Info */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-6 border border-blue-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{texts.dailyProgress || "Daily Progress"}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Battery className={`w-3 h-3 ${percent >= 66 ? 'text-green-500' : percent >= 33 ? 'text-yellow-500' : 'text-red-500'}`} />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{percent}%</span>
            </div>
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
                  ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{texts.timer || "Timer"} {timerEnabled ? (texts.on || "ON") : (texts.off || "OFF")}</span>
            </button>
          </div>
        </div>

        <div className="relative w-full h-5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-out ${
              percent === 100 
                ? 'bg-gradient-to-r from-green-400 to-green-600' 
                : 'bg-gradient-to-r from-blue-400 to-cyan-500'
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
          <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800 animate-pulse">
            <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {texts.recoveryAvailable || "Recovery day available! Complete all tasks to restore your streak."}
            </p>
          </div>
        )}

        {streakMilestones.length > 0 && streakMilestones[0].remaining > 0 && (
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Next milestone: {streakMilestones[0].next} days</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">{streakMilestones[0].remaining} days to go</span>
          </div>
        )}
      </div>

      {/* Task List with Enhanced Interactions */}
      <section className="space-y-3">
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
              className={`group relative w-full flex justify-between items-center p-5 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                isDone
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-400 dark:border-green-600 shadow-md"
                  : isRunning
                  ? "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-400 dark:border-blue-600 shadow-lg scale-[1.02]"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl hover:scale-[1.02]"
              }`}
            >
              {/* Ripple effect */}
              {touchRipple.active && (
                <span
                  className="absolute bg-white/30 rounded-full pointer-events-none animate-ripple"
                  style={{
                    left: touchRipple.x - 50,
                    top: touchRipple.y - 50,
                    width: 100,
                    height: 100
                  }}
                />
              )}

              {/* Progress ring for active timer */}
              {isRunning && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke="rgba(59, 130, 246, 0.2)"
                    strokeWidth="4"
                    className="animate-spin-slow"
                  />
                </svg>
              )}

              <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                  {isDone ? (
                    <div className="relative">
                      <CheckCircle2 className="w-7 h-7 text-green-500 animate-bounce" />
                      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
                    </div>
                  ) : (
                    <Circle className={`w-7 h-7 transition-all duration-300 ${
                      isHovered ? 'text-blue-400 scale-110' : 'text-gray-300 dark:text-gray-600'
                    }`} />
                  )}
                </div>
                <div className="text-left">
                  <span className="capitalize font-bold text-gray-900 dark:text-white text-lg block">
                    {task === "morning" ? (texts.morningBrushing || "Morning Brushing") : (texts.nightBrushing || "Night Brushing")}
                  </span>
                  {isRunning && (
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 mt-1">
                      <Activity className="w-3 h-3 animate-pulse" />
                      {texts.brushCircular || "Brush in circular motions..."}
                    </span>
                  )}
                  {!isRunning && !isDone && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      2 minutes recommended
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 relative z-10">
                {isRunning ? (
                  <div className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg animate-pulse">
                    <Clock className="w-4 h-4" />
                    {formatTime(timeLeft)}
                  </div>
                ) : isDone ? (
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">{texts.complete || "Complete"}</span>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-gray-400 group-hover:text-blue-400 transition-colors">
                    <Play className="w-4 h-4" />
                    <span className="text-xs">Start</span>
                  </div>
                )}
                <span className="text-3xl transform group-hover:scale-110 group-hover:rotate-12 transition-transform">
                  {task === "morning" ? "☀️" : "🌙"}
                </span>
              </div>
            </button>
          );
        })}

        {/* Interdental Care with Enhanced Options */}
        <button
          onClick={() => toggleTask("floss")}
          className={`group relative w-full flex justify-between items-center p-5 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
            todayData.floss
              ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-400 dark:border-green-600 shadow-md"
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl hover:scale-[1.02]"
          }`}
        >
          <div className="flex items-center gap-3">
            {todayData.floss ? (
              <div className="relative">
                <CheckCircle2 className="w-7 h-7 text-green-500 animate-bounce" />
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
              </div>
            ) : (
              <Circle className="w-7 h-7 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 transition-colors" />
            )}
            <div className="text-left">
              <span className="font-bold text-gray-900 dark:text-white text-lg block">{texts.interdentalCare || "Interdental Care"}</span>
              <select
                value={interdentalType}
                onChange={(e) => setInterdentalType(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="text-xs mt-1 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>{texts.floss || "Floss"}</option>
                <option>{texts.waterPick || "Water Pick"}</option>
                <option>{texts.interdentalBrush || "Interdental Brush"}</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {todayData.floss && (
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">{texts.complete || "Complete"}</span>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </div>
            )}
            <span className="text-3xl transform group-hover:scale-110 group-hover:rotate-12 transition-transform">
              🧵
            </span>
          </div>
        </button>
      </section>

      {/* Enhanced Daily Tip with More Features */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-gray-900 dark:text-white text-base">{texts.dailyTip || "Daily Tip"}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowInsights(!showInsights)}
                  className="p-1.5 hover:bg-white/50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </button>
                <button
                  onClick={() => setShowAchievements(!showAchievements)}
                  className="p-1.5 hover:bg-white/50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {completedCount === 0 && (texts.tip0 || "Start with your morning brush to set a positive tone for the day!")}
              {completedCount === 1 && (texts.tip1 || "Don't forget to angle your brush at 45° towards the gum line.")}
              {completedCount === 2 && (texts.tip2 || "Great job! Remember to replace your toothbrush every 3 months.")}
              {completedCount === 3 && (texts.tip3 || "Perfect! Regular flossing reduces your risk of gum disease by 40%.")}
            </p>
            
            {/* Achievements Preview */}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {badges.map((badge, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                      badge.color === 'gold' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      badge.color === 'silver' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                      badge.color === 'bronze' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}
                  >
                    {badge.icon}
                    <span>{badge.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 p-4 flex justify-around items-center z-40">
        <button
          onClick={() => setShowInsights(!showInsights)}
          className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs">{texts.insights || "Insights"}</span>
        </button>
        
        <button
          onClick={() => setShowAchievements(!showAchievements)}
          className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors relative"
        >
          <Award className="w-5 h-5" />
          <span className="text-xs">{texts.achievements || "Achievements"}</span>
          {badges.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full text-[10px] text-white flex items-center justify-center">
              {badges.length}
            </span>
          )}
        </button>
        
        <button
          onClick={() => setShowReminders(!showReminders)}
          className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="text-xs">{texts.reminders || "Reminders"}</span>
        </button>
        
        <button
          onClick={() => setShowShareModal(true)}
          className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-xs">{texts.shareProgress || "Share"}</span>
        </button>
        
        <button
          onClick={startBreathing}
          className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          <Wind className="w-5 h-5" />
          <span className="text-xs">Breathe</span>
        </button>
      </div>

      {/* Breathing Exercise Modal */}
      {breathingExercise && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-sm w-full p-8 text-center">
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center animate-pulse">
                <Wind className="w-12 h-12 text-white" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 border-4 border-blue-400 rounded-full animate-ping opacity-20" />
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              {breathPhase === 'inhale' ? 'Inhale' : breathPhase === 'hold' ? 'Hold' : 'Exhale'}
            </h3>
            <p className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-4">
              {breathCount}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Follow the rhythm to relax before brushing
            </p>
            
            <button
              onClick={() => setBreathingExercise(false)}
              className="w-full py-3 bg-gray-200 dark:bg-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-sm w-full p-6">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">
              Share Your Progress
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <Download className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900 dark:text-white">Save as Image</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <Share2 className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-900 dark:text-white">Share with Friends</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900 dark:text-white">Export Data</span>
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
import { useEffect, useState, useContext, useRef } from “react”;
import { getDateKey, getYesterdayKey } from “../utils/date.js”;
import { calculateStreaks } from “../utils/streak.js”;
import {
Flame, Trophy, Clock, CheckCircle2, Circle, Sparkles,
Target, Activity, Brush, Award, Share2,
ChevronRight, Calendar, Zap, Star
} from “lucide-react”;
import { TranslationContext } from “../App”;

const BRUSH_TIME = 120;
const RECOVERY_KEY = “__lastRecoveryUsed”;

export default function Today({ habitData, setHabitData, setActiveTab }) {
const { t, currentLanguage } = useContext(TranslationContext);
const [texts, setTexts] = useState({});
const [consistencyScore, setConsistencyScore] = useState(0);
const [streakMilestones, setStreakMilestones] = useState([]);
const [streakMultiplier, setStreakMultiplier] = useState(1);
const [badges, setBadges] = useState([]);
const [showCompletion, setShowCompletion] = useState(false);
const [showShareModal, setShowShareModal] = useState(false);

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
const missedYesterday = yesterdayData && [“morning”, “night”, “floss”].some((task) => yesterdayData[task] === false);
const isRecoveryDay = missedYesterday && recoveryAvailable;

const [activeTimer, setActiveTimer] = useState(null);
const [timeLeft, setTimeLeft] = useState(BRUSH_TIME);
const [timerEnabled, setTimerEnabled] = useState(false);
const [interdentalType, setInterdentalType] = useState(“Floss”);
const [, forceUpdate] = useState(0);

useEffect(() => {
forceUpdate((v) => v + 1);
}, [habitData]);

useEffect(() => {
const translateAll = async () => {
setTexts({
dayComplete: await t(“Day Complete!”),
recoverySaved: await t(“Recovery streak saved!”),
perfectConsistency: await t(“Perfect consistency!”),
todaysRoutine: await t(“Today’s Routine”),
currentStreak: await t(“Current Streak”),
current: await t(“Current”),
best: await t(“Best”),
today: await t(“Today”),
dailyProgress: await t(“Daily Progress”),
timer: await t(“Timer”),
on: await t(“ON”),
off: await t(“OFF”),
recoveryAvailable: await t(“Recovery day available! Complete all tasks to restore your streak.”),
morningBrushing: await t(“Morning Brushing”),
nightBrushing: await t(“Night Brushing”),
brushCircular: await t(“Brush in circular motions…”),
complete: await t(“Complete”),
interdentalCare: await t(“Interdental Care”),
floss: await t(“Floss”),
waterPick: await t(“Water Pick”),
interdentalBrush: await t(“Interdental Brush”),
dailyTip: await t(“Daily Tip”),
tip0: await t(“Start with your morning brush to set a positive tone for the day!”),
tip1: await t(“Don’t forget to angle your brush at 45° towards the gum line.”),
tip2: await t(“Great job! Remember to replace your toothbrush every 3 months.”),
tip3: await t(“Perfect! Regular flossing reduces your risk of gum disease by 40%.”),
motivate0: await t(“Let’s start your day right! 💪”),
motivate1: await t(“Great start! Keep going! 🌟”),
motivate2: await t(“Almost there! One more to go! 🎯”),
motivate3: await t(“Perfect day! You’re unstoppable! 🔥”),
consistencyScore: await t(“Consistency Score”),
streakMultiplier: await t(“Streak Multiplier”),
nextMilestone: await t(“Next Milestone”),
daysRemaining: await t(“days remaining”),
});
};
translateAll();
}, [currentLanguage, t]);

useEffect(() => {
const weekData = [];
for (let i = 0; i < 7; i++) {
const date = new Date();
date.setDate(date.getDate() - i);
const dateKey = getDateKey(date);
const day = habitData[dateKey];
if (day) {
const completed = [“morning”, “night”, “floss”].filter(k => day[k]).length;
weekData.push(completed / 3);
}
}
const avg = weekData.reduce((a, b) => a + b, 0) / 7 * 100;
setConsistencyScore(Math.round(avg) || 0);

```
const { current, longest } = calculateStreaks(habitData);

if (current >= 30) setStreakMultiplier(2);
else if (current >= 14) setStreakMultiplier(1.5);
else if (current >= 7) setStreakMultiplier(1.25);
else setStreakMultiplier(1);

const newBadges = [];
if (longest >= 7) newBadges.push('Week Warrior');
if (longest >= 30) newBadges.push('Monthly Master');
if (longest >= 100) newBadges.push('Century Club');

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

const milestones = [7, 30, 60, 90, 180, 365];
const next = milestones.find(m => m > current) || 365;
setStreakMilestones([{ current, next, remaining: next - current }]);
```

}, [habitData]);

const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

const toggleTask = (task) => {
const nextValue = !todayData[task];
const completedNow = Object.values({ …todayData, [task]: nextValue }).filter(Boolean).length;

```
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
```

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

```
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
```

}, [activeTimer]);

const completedCount = [“morning”, “night”, “floss”].filter((k) => todayData[k]).length;
const percent = Math.round((completedCount / 3) * 100);
const { current, longest } = calculateStreaks(habitData);

const dayLabel = new Date().toLocaleDateString(‘en-US’, { weekday: ‘long’, month: ‘long’, day: ‘numeric’ });

const tipText = [
“Start with your morning brush to set a positive tone for the day!”,
“Angle your brush at 45° towards the gum line for deeper clean.”,
“Great job! Replace your toothbrush every 3 months.”,
“Perfect! Regular flossing reduces gum disease risk by 40%.”,
][completedCount];

return (
<>
<style>{`
@import url(‘https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap’);

```
    .today-root {
      font-family: 'DM Sans', sans-serif;
      min-height: 100vh;
      background: #f7f5f2;
      color: #1a1814;
    }

    .serif { font-family: 'Fraunces', Georgia, serif; }

    /* Completion overlay */
    .completion-overlay {
      position: fixed; inset: 0;
      background: rgba(26,24,20,0.35);
      backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      z-index: 60;
      animation: fadeIn 0.2s ease;
    }
    .completion-card {
      background: #fffdf9;
      border-radius: 28px;
      padding: 40px 48px;
      text-align: center;
      box-shadow: 0 32px 80px rgba(26,24,20,0.18);
      animation: popUp 0.35s cubic-bezier(0.34,1.56,0.64,1);
    }
    .completion-icon {
      width: 72px; height: 72px;
      background: linear-gradient(135deg, #c8b89a 0%, #e8ddd0 100%);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
      font-size: 32px;
    }
    .completion-title {
      font-family: 'Fraunces', serif;
      font-size: 28px;
      font-weight: 400;
      color: #1a1814;
      margin: 0 0 8px;
    }
    .completion-sub {
      font-size: 14px;
      color: #8a7f72;
      margin: 0;
    }

    /* Header */
    .today-header {
      background: #fffdf9;
      border-bottom: 1px solid #ede8e0;
      padding: 18px 20px 16px;
      position: sticky; top: 0; z-index: 30;
    }
    .today-header-inner {
      max-width: 560px; margin: 0 auto;
      display: flex; align-items: flex-end; justify-content: space-between;
    }
    .today-header-title {
      font-family: 'Fraunces', serif;
      font-size: 26px;
      font-weight: 400;
      letter-spacing: -0.3px;
      color: #1a1814;
      margin: 0 0 2px;
      line-height: 1;
    }
    .today-header-date {
      font-size: 12px;
      color: #a09588;
      font-weight: 400;
      letter-spacing: 0.4px;
      text-transform: uppercase;
    }
    .timer-toggle {
      display: flex; align-items: center; gap: 7px;
      padding: 8px 14px;
      border-radius: 50px;
      border: 1.5px solid #ddd8cf;
      background: transparent;
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      font-weight: 500;
      color: #6b6258;
      cursor: pointer;
      transition: all 0.18s ease;
      letter-spacing: 0.3px;
    }
    .timer-toggle:hover { background: #f0ebe3; border-color: #c8b89a; }
    .timer-toggle.active {
      background: #1a1814;
      border-color: #1a1814;
      color: #f7f5f2;
    }
    .timer-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #c8b89a;
      transition: background 0.18s;
    }
    .timer-toggle.active .timer-dot { background: #c8b89a; }

    /* Content */
    .today-content {
      max-width: 560px;
      margin: 0 auto;
      padding: 28px 20px 48px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Motivation line */
    .motivation-line {
      font-family: 'Fraunces', serif;
      font-size: 17px;
      font-weight: 300;
      font-style: italic;
      color: #8a7f72;
      padding-left: 2px;
    }

    /* Progress arc + stats */
    .progress-hero {
      background: #fffdf9;
      border-radius: 24px;
      padding: 24px;
      border: 1px solid #ede8e0;
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .arc-wrapper {
      flex-shrink: 0;
      position: relative;
      width: 96px; height: 96px;
    }
    .arc-svg { transform: rotate(-90deg); }
    .arc-bg { fill: none; stroke: #ede8e0; stroke-width: 8; }
    .arc-fill {
      fill: none;
      stroke: #1a1814;
      stroke-width: 8;
      stroke-linecap: round;
      transition: stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1);
    }
    .arc-text {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
    }
    .arc-pct {
      font-family: 'Fraunces', serif;
      font-size: 22px;
      font-weight: 500;
      color: #1a1814;
      line-height: 1;
    }
    .arc-label {
      font-size: 10px;
      color: #a09588;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      margin-top: 2px;
    }
    .stats-grid {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .stat-item { display: flex; flex-direction: column; gap: 2px; }
    .stat-value {
      font-family: 'Fraunces', serif;
      font-size: 20px;
      font-weight: 500;
      color: #1a1814;
      line-height: 1;
    }
    .stat-label {
      font-size: 11px;
      color: #a09588;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }

    /* Recovery notice */
    .recovery-notice {
      background: linear-gradient(135deg, #fdf8f0 0%, #fef3e0 100%);
      border: 1px solid #f0d99a;
      border-radius: 16px;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      color: #8a6f2e;
    }
    .recovery-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #d4a012;
      flex-shrink: 0;
      animation: pulse 2s infinite;
    }

    /* Task cards */
    .task-card {
      background: #fffdf9;
      border: 1.5px solid #ede8e0;
      border-radius: 20px;
      padding: 18px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
      text-align: left;
      font-family: 'DM Sans', sans-serif;
    }
    .task-card:hover:not(.done) {
      border-color: #c8b89a;
      box-shadow: 0 4px 20px rgba(26,24,20,0.06);
      transform: translateY(-1px);
    }
    .task-card.done {
      background: #1a1814;
      border-color: #1a1814;
    }
    .task-card.running {
      border-color: #c8b89a;
      box-shadow: 0 0 0 3px rgba(200,184,154,0.2);
      background: #fffdf9;
    }
    .task-left { display: flex; align-items: center; gap: 14px; }
    .task-icon-wrap {
      width: 44px; height: 44px;
      border-radius: 14px;
      background: #f0ebe3;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px;
      transition: background 0.2s;
    }
    .task-card.done .task-icon-wrap { background: rgba(255,255,255,0.1); }
    .task-name {
      font-size: 15px;
      font-weight: 500;
      color: #1a1814;
      line-height: 1.2;
    }
    .task-card.done .task-name { color: #f7f5f2; }
    .task-sub {
      font-size: 12px;
      color: #a09588;
      margin-top: 3px;
    }
    .task-card.done .task-sub { color: rgba(247,245,242,0.5); }
    .task-right { display: flex; align-items: center; gap: 10px; }
    .task-check {
      width: 28px; height: 28px;
      border-radius: 50%;
      border: 2px solid #ddd8cf;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .task-card.done .task-check {
      background: #f7f5f2;
      border-color: transparent;
    }
    .task-check-inner {
      width: 10px; height: 10px;
      border-radius: 50%;
      background: #1a1814;
      display: none;
    }
    .task-card.done .task-check-inner { display: block; }

    /* Timer badge */
    .timer-badge {
      background: #1a1814;
      color: #f7f5f2;
      padding: 6px 12px;
      border-radius: 50px;
      font-size: 13px;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
      letter-spacing: 0.5px;
      display: flex; align-items: center; gap: 5px;
    }
    .task-card.running .timer-badge { background: #c8b89a; color: #1a1814; }

    /* Interdental select */
    .floss-select {
      appearance: none;
      background: transparent;
      border: none;
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      color: #a09588;
      cursor: pointer;
      padding: 0;
      outline: none;
    }
    .task-card.done .floss-select { color: rgba(247,245,242,0.5); }

    /* Milestone bar */
    .milestone-wrap {
      background: #fffdf9;
      border: 1px solid #ede8e0;
      border-radius: 20px;
      padding: 18px 20px;
    }
    .milestone-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 12px;
    }
    .milestone-title {
      font-size: 13px;
      color: #6b6258;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .milestone-nums {
      font-family: 'Fraunces', serif;
      font-size: 13px;
      color: #a09588;
    }
    .milestone-bar {
      height: 5px;
      background: #ede8e0;
      border-radius: 999px;
      overflow: hidden;
    }
    .milestone-fill {
      height: 100%;
      background: #1a1814;
      border-radius: 999px;
      transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
    }
    .milestone-caption {
      margin-top: 8px;
      font-size: 12px;
      color: #a09588;
    }

    /* Tip card */
    .tip-card {
      background: linear-gradient(135deg, #1a1814 0%, #2d2924 100%);
      border-radius: 20px;
      padding: 20px 22px;
      display: flex;
      gap: 14px;
      align-items: flex-start;
    }
    .tip-pip {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #c8b89a;
      flex-shrink: 0;
      margin-top: 6px;
    }
    .tip-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #c8b89a;
      font-weight: 500;
      margin-bottom: 6px;
    }
    .tip-text {
      font-family: 'Fraunces', serif;
      font-size: 15px;
      font-weight: 300;
      color: #e8ddd0;
      line-height: 1.55;
      font-style: italic;
    }

    /* Badges */
    .badges-wrap {
      background: #fffdf9;
      border: 1px solid #ede8e0;
      border-radius: 20px;
      padding: 18px 20px;
    }
    .badges-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #a09588;
      font-weight: 500;
      margin-bottom: 12px;
    }
    .badges-row { display: flex; flex-wrap: wrap; gap: 8px; }
    .badge-pill {
      padding: 7px 14px;
      background: #f0ebe3;
      border-radius: 50px;
      font-size: 12px;
      color: #6b6258;
      font-weight: 500;
      display: flex; align-items: center; gap: 6px;
      border: 1px solid #e0d8cc;
    }
    .badge-star {
      color: #c8b89a;
      font-size: 13px;
    }

    /* Share button */
    .share-btn {
      width: 100%;
      padding: 15px;
      border-radius: 18px;
      border: 1.5px dashed #ddd8cf;
      background: transparent;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      color: #a09588;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: all 0.2s;
    }
    .share-btn:hover {
      border-color: #c8b89a;
      color: #6b6258;
      background: #f7f5f2;
    }

    /* Share modal */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(26,24,20,0.4);
      backdrop-filter: blur(8px);
      z-index: 50;
      display: flex; align-items: flex-end; justify-content: center;
      padding: 0 0 env(safe-area-inset-bottom, 0);
      animation: fadeIn 0.2s ease;
    }
    .modal-card {
      background: #fffdf9;
      border-radius: 28px 28px 0 0;
      padding: 28px 24px 36px;
      width: 100%;
      max-width: 560px;
      animation: slideUp 0.3s cubic-bezier(0.34,1.3,0.64,1);
    }
    .modal-handle {
      width: 36px; height: 4px;
      background: #ddd8cf;
      border-radius: 2px;
      margin: 0 auto 20px;
    }
    .modal-title {
      font-family: 'Fraunces', serif;
      font-size: 22px;
      font-weight: 400;
      color: #1a1814;
      margin: 0 0 18px;
    }
    .modal-share-btn {
      width: 100%;
      padding: 15px 18px;
      background: #1a1814;
      border: none;
      border-radius: 16px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #f7f5f2;
      cursor: pointer;
      display: flex; align-items: center; gap: 10px;
      transition: opacity 0.18s;
    }
    .modal-share-btn:hover { opacity: 0.85; }
    .modal-close {
      width: 100%;
      padding: 14px;
      background: transparent;
      border: 1.5px solid #ede8e0;
      border-radius: 16px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      color: #a09588;
      cursor: pointer;
      margin-top: 10px;
      transition: all 0.18s;
    }
    .modal-close:hover { background: #f0ebe3; }

    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
    @keyframes popUp {
      from { transform: scale(0.8) translateY(10px); opacity: 0; }
      to   { transform: scale(1) translateY(0); opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(40px); opacity: 0; }
      to   { transform: translateY(0); opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  `}</style>

  <div className="today-root">

    {/* Completion overlay */}
    {showCompletion && (
      <div className="completion-overlay">
        <div className="completion-card">
          <div className="completion-icon">✨</div>
          <p className="completion-title">{texts.dayComplete || "Day Complete!"}</p>
          <p className="completion-sub">
            {isRecoveryDay ? "Recovery streak saved!" : "Perfect consistency!"}
          </p>
          {streakMultiplier > 1 && (
            <p style={{ fontSize: 12, color: '#c8b89a', marginTop: 10, fontWeight: 500 }}>
              {streakMultiplier}x Streak Multiplier Active
            </p>
          )}
        </div>
      </div>
    )}

    {/* Header */}
    <div className="today-header">
      <div className="today-header-inner">
        <div>
          <h1 className="today-header-title">Today's Routine</h1>
          <p className="today-header-date">{dayLabel}</p>
        </div>
        <button onClick={toggleTimer} className={`timer-toggle ${timerEnabled ? 'active' : ''}`}>
          <div className="timer-dot" />
          <Clock size={13} />
          {timerEnabled ? 'Timer On' : 'Timer Off'}
        </button>
      </div>
    </div>

    <div className="today-content">

      {/* Motivation */}
      <p className="motivation-line">
        {completedCount === 0 && "Let's start your day right."}
        {completedCount === 1 && "Great start — keep going."}
        {completedCount === 2 && "Almost there, one more to go."}
        {completedCount === 3 && "Perfect day. You're unstoppable."}
      </p>

      {/* Progress hero */}
      <div className="progress-hero">
        <div className="arc-wrapper">
          <svg width="96" height="96" className="arc-svg">
            <circle className="arc-bg" cx="48" cy="48" r="40" />
            <circle
              className="arc-fill"
              cx="48" cy="48" r="40"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - percent / 100)}`}
            />
          </svg>
          <div className="arc-text">
            <span className="arc-pct">{percent}%</span>
            <span className="arc-label">Done</span>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{current}</span>
            <span className="stat-label">Streak</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{longest}</span>
            <span className="stat-label">Best</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{completedCount}/3</span>
            <span className="stat-label">Today</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{consistencyScore}%</span>
            <span className="stat-label">Score</span>
          </div>
        </div>
      </div>

      {/* Recovery */}
      {isRecoveryDay && (
        <div className="recovery-notice">
          <div className="recovery-dot" />
          <span>Recovery day — complete all tasks to restore your streak.</span>
        </div>
      )}

      {/* Tasks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {["morning", "night"].map((task) => {
          const isDone = todayData[task];
          const isRunning = activeTimer === task;
          return (
            <button
              key={task}
              onClick={() => {
                if (isDone) { toggleTask(task); }
                else if (timerEnabled && !isDone) { setActiveTimer(task); setTimeLeft(BRUSH_TIME); }
                else { toggleTask(task); }
              }}
              className={`task-card ${isDone ? 'done' : ''} ${isRunning ? 'running' : ''}`}
            >
              <div className="task-left">
                <div className="task-icon-wrap">
                  {task === 'morning' ? '☀️' : '🌙'}
                </div>
                <div>
                  <div className="task-name">
                    {task === 'morning' ? 'Morning Brushing' : 'Night Brushing'}
                  </div>
                  <div className="task-sub">
                    {isRunning ? 'Brush in circular motions…' : isDone ? 'Completed' : '2 minutes recommended'}
                  </div>
                </div>
              </div>
              <div className="task-right">
                {isRunning ? (
                  <div className="timer-badge">
                    <Clock size={12} /> {formatTime(timeLeft)}
                  </div>
                ) : (
                  <div className="task-check">
                    <div className="task-check-inner" />
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {/* Floss */}
        <button
          onClick={() => { if (!todayData.floss) toggleTask("floss"); }}
          className={`task-card ${todayData.floss ? 'done' : ''}`}
        >
          <div className="task-left">
            <div className="task-icon-wrap">🧵</div>
            <div>
              <div className="task-name">Interdental Care</div>
              <div className="task-sub">
                <select
                  value={interdentalType}
                  onChange={(e) => setInterdentalType(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="floss-select"
                >
                  <option>Floss</option>
                  <option>Water Pick</option>
                  <option>Interdental Brush</option>
                </select>
              </div>
            </div>
          </div>
          <div className="task-right">
            <div className="task-check">
              <div className="task-check-inner" />
            </div>
          </div>
        </button>
      </div>

      {/* Milestone */}
      {streakMilestones.length > 0 && streakMilestones[0].remaining > 0 && (
        <div className="milestone-wrap">
          <div className="milestone-header">
            <span className="milestone-title">Next Milestone</span>
            <span className="milestone-nums serif">{current} → {streakMilestones[0].next} days</span>
          </div>
          <div className="milestone-bar">
            <div
              className="milestone-fill"
              style={{ width: `${Math.min(100, (current / streakMilestones[0].next) * 100)}%` }}
            />
          </div>
          <p className="milestone-caption">{streakMilestones[0].remaining} days remaining</p>
        </div>
      )}

      {/* Daily tip */}
      <div className="tip-card">
        <div className="tip-pip" />
        <div>
          <div className="tip-label">Daily Tip</div>
          <div className="tip-text">{tipText}</div>
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="badges-wrap">
          <div className="badges-title">Achievements</div>
          <div className="badges-row">
            {badges.map((badge, i) => (
              <div key={i} className="badge-pill">
                <span className="badge-star">★</span>
                {badge}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share */}
      <button className="share-btn" onClick={() => setShowShareModal(true)}>
        <Share2 size={16} />
        Share your progress
      </button>
    </div>

    {/* Share Modal */}
    {showShareModal && (
      <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-handle" />
          <h3 className="modal-title">Share your progress</h3>
          <button className="modal-share-btn">
            <Share2 size={16} />
            Share with friends
          </button>
          <button className="modal-close" onClick={() => setShowShareModal(false)}>
            Close
          </button>
        </div>
      </div>
    )}
  </div>
</>
```

);
}
import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { getDateKey, getYesterdayKey } from "../utils/date.js";
import { calculateStreaks } from "../utils/streak.js";
import { translateBatch } from "../utils/translate.js";
import { Clock, CheckCircle2, Circle, Share2, Heart } from "lucide-react";
import { TranslationContext } from "../App";

const BRUSH_TIME = 120;
const RECOVERY_KEY = "__lastRecoveryUsed";
const WATER_GOAL_OZ = 64;

const DENTAL_TIPS_EN = [
  { title: "Circular Motion",    body: "Use small circular strokes rather than scrubbing — gentler on enamel and reaches the gum line better.", icon: "🔄" },
  { title: "45° Angle",          body: "Tilt your brush at 45° to the gum line so bristles slip just under the gums where plaque hides.", icon: "📐" },
  { title: "Two Full Minutes",   body: "Spend 30 seconds per quadrant. Most people only brush for 45 seconds — a timer makes a real difference.", icon: "⏱️" },
  { title: "Brush Your Tongue",  body: "Your tongue harbours bacteria that cause bad breath. Give it a gentle brush or scrape each time.", icon: "👅" },
  { title: "Wait After Eating",  body: "Wait 30 minutes after meals before brushing — acidic food softens enamel and brushing too soon wears it away.", icon: "🍎" },
  { title: "Stay Hydrated",      body: "Water washes away food particles and prevents dry mouth, a leading cause of cavities.", icon: "💧" },
  { title: "Replace Your Brush", body: "Swap your toothbrush every 3–4 months or when bristles splay — a worn brush cleans far less effectively.", icon: "🪥" },
  { title: "Floss First",        body: "Flossing before you brush loosens debris between teeth so your toothpaste can reach those surfaces too.", icon: "🧵" },
];

const MOOD_OPTIONS = [
  { emoji: "🤩", labelKey: "Energised" },
  { emoji: "😊", labelKey: "Good" },
  { emoji: "😌", labelKey: "Calm" },
  { emoji: "😴", labelKey: "Tired" },
  { emoji: "😐", labelKey: "Meh" },
  { emoji: "😷", labelKey: "Unwell" },
];

const BADGE_META = {
  "Week Warrior":   { emoji: "🛡️", bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-100" },
  "Monthly Master": { emoji: "👑", bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-100" },
  "Century Club":   { emoji: "🏆", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-100" },
  "Perfect Week":   { emoji: "✨", bg: "bg-green-50",  text: "text-green-700",  border: "border-green-100" },
  "Perfect Month":  { emoji: "🌟", bg: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-100" },
};

// All UI strings to translate
const UI_STRINGS = [
  "Day Complete!", "Recovery streak saved!", "Today's Routine",
  "This Week", "Recovery Day!", "Complete all 3 tasks to restore your streak.",
  "Daily Tasks", "of 3 completed", "Use Timer", "Timer On",
  "Morning Brushing", "Night Brushing", "Interdental Care",
  "Brush in circular motions…", "Completed", "2 minutes recommended",
  "Floss", "Water Pick", "Interdental Brush",
  "Water Intake", "Goal: 64 fl oz · 8 cups · ~2 L", "Daily hydration goal reached!",
  "Today's Mood", "How are you feeling?", "Log mood",
  "Next Milestone", "days to go — keep it up!",
  "Tip of the Day", "All Brushing Tips",
  "Today's Note", "Edit", "Achievements",
  "Share Your Progress", "Share with Friends",
  "Daily Reflection", "Jot down a thought about your routine today.",
  "How did brushing feel today? Anything to improve?…", "Save", "Cancel", "Close",
  "How are you feeling?",
  "Let's start your day right!", "Great start — keep going!",
  "Almost there, one more to go!", "All done — you're unstoppable!",
  "tasks remaining", "task remaining", "All tasks complete today",
  "Multiplier Active", "Streak", "Best", "Score", "Boost",
  "Energised", "Good", "Calm", "Tired", "Meh", "Unwell",
  "Week Warrior", "Monthly Master", "Century Club", "Perfect Week", "Perfect Month",
  "Circular Motion", "45° Angle", "Two Full Minutes", "Brush Your Tongue",
  "Wait After Eating", "Stay Hydrated", "Replace Your Brush", "Floss First",
];

export default function Today({ habitData, setHabitData }) {
  const { currentLanguage } = useContext(TranslationContext);

  // Translation state
  const [tx, setTx] = useState({});
  const [translatedTips, setTranslatedTips] = useState(DENTAL_TIPS_EN);
  const [translatedMoods, setTranslatedMoods] = useState(MOOD_OPTIONS);
  const [translatedBadgeNames, setTranslatedBadgeNames] = useState({});

  // UI state
  const [consistencyScore, setConsistencyScore] = useState(0);
  const [streakMilestones, setStreakMilestones] = useState([]);
  const [streakMultiplier, setStreakMultiplier] = useState(1);
  const [badges, setBadges] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [reflectionText, setReflectionText] = useState("");
  const [waterOz, setWaterOz] = useState(0);
  const [currentMood, setCurrentMood] = useState(null);
  const [weekDots, setWeekDots] = useState([]);
  const [tipIndex, setTipIndex] = useState(0);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const today = getDateKey();
  const yesterday = getYesterdayKey(today);
  const todayData = habitData[today] || { morning: false, night: false, floss: false, reflection: null, mood: null, waterOz: 0 };
  const yesterdayData = habitData[yesterday];
  const lastRecovery = habitData[RECOVERY_KEY];
  const lastRecoveryDate = lastRecovery ? new Date(lastRecovery) : null;
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recoveryAvailable = !lastRecoveryDate || lastRecoveryDate < oneWeekAgo;
  const missedYesterday = yesterdayData && ["morning", "night", "floss"].some(k => yesterdayData[k] === false);
  const isRecoveryDay = missedYesterday && recoveryAvailable;

  const [activeTimer, setActiveTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(BRUSH_TIME);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [interdentalType, setInterdentalType] = useState("Floss");
  const [, forceUpdate] = useState(0);
  const timerIntervalRef = useRef(null);

  useEffect(() => { forceUpdate(v => v + 1); }, [habitData]);
  useEffect(() => { setTipIndex(new Date().getDate() % DENTAL_TIPS_EN.length); }, []);

  // ── Translation: batch-translate all UI strings + tips + moods + badge names ──
  useEffect(() => {
    if (!currentLanguage || currentLanguage === "en") {
      // Reset to English
      const map = {};
      UI_STRINGS.forEach(s => { map[s] = s; });
      setTx(map);
      setTranslatedTips(DENTAL_TIPS_EN);
      setTranslatedMoods(MOOD_OPTIONS);
      const bm = {};
      Object.keys(BADGE_META).forEach(k => { bm[k] = k; });
      setTranslatedBadgeNames(bm);
      return;
    }

    const run = async () => {
      try {
        // Translate UI strings
        const uiTranslated = await translateBatch(UI_STRINGS, currentLanguage, "en");
        const map = {};
        UI_STRINGS.forEach((s, i) => { map[s] = uiTranslated[i] ?? s; });
        setTx(map);

        // Translate tip titles + bodies
        const tipTexts = DENTAL_TIPS_EN.flatMap(t => [t.title, t.body]);
        const tipTranslated = await translateBatch(tipTexts, currentLanguage, "en");
        setTranslatedTips(DENTAL_TIPS_EN.map((t, i) => ({
          ...t,
          title: tipTranslated[i * 2] ?? t.title,
          body:  tipTranslated[i * 2 + 1] ?? t.body,
        })));

        // Translate mood labels
        const moodLabels = MOOD_OPTIONS.map(m => m.labelKey);
        const moodTranslated = await translateBatch(moodLabels, currentLanguage, "en");
        setTranslatedMoods(MOOD_OPTIONS.map((m, i) => ({ ...m, label: moodTranslated[i] ?? m.labelKey })));

        // Translate badge names
        const badgeKeys = Object.keys(BADGE_META);
        const badgeTranslated = await translateBatch(badgeKeys, currentLanguage, "en");
        const bm = {};
        badgeKeys.forEach((k, i) => { bm[k] = badgeTranslated[i] ?? k; });
        setTranslatedBadgeNames(bm);
      } catch (err) {
        console.error("Translation failed:", err);
      }
    };
    run();
  }, [currentLanguage]);

  // Helper: get translated string (falls back to original)
  const T = useCallback((key) => tx[key] ?? key, [tx]);

  // ── Stats calculation ──
  useEffect(() => {
    const dots = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const day = habitData[getDateKey(d)];
      const done = day ? ["morning","night","floss"].filter(k => day[k]).length : 0;
      dots.push({ label: d.toLocaleDateString("en-US", { weekday:"short" }).slice(0,1), done, isToday: i === 0 });
    }
    setWeekDots(dots);

    const scores = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const day = habitData[getDateKey(d)];
      if (day) scores.push(["morning","night","floss"].filter(k => day[k]).length / 3);
    }
    setConsistencyScore(Math.round(scores.reduce((a,b) => a+b, 0) / 7 * 100) || 0);

    const { current, longest } = calculateStreaks(habitData);
    setStreakMultiplier(current >= 30 ? 2 : current >= 14 ? 1.5 : current >= 7 ? 1.25 : 1);

    const nb = [];
    if (longest >= 7) nb.push("Week Warrior");
    if (longest >= 30) nb.push("Monthly Master");
    if (longest >= 100) nb.push("Century Club");
    let pw = true;
    for (let i = 0; i < 7; i++) { const d = new Date(); d.setDate(d.getDate()-i); const day = habitData[getDateKey(d)]; if (!day||!day.morning||!day.night||!day.floss){pw=false;break;} }
    if (pw) nb.push("Perfect Week");
    let pm = true;
    for (let i = 0; i < 30; i++) { const d = new Date(); d.setDate(d.getDate()-i); const day = habitData[getDateKey(d)]; if (!day||!day.morning||!day.night||!day.floss){pm=false;break;} }
    if (pm) nb.push("Perfect Month");
    setBadges(nb);

    const milestones = [7,30,60,90,180,365];
    const next = milestones.find(m => m > current) || 365;
    setStreakMilestones([{ current, next, remaining: next - current }]);

    setWaterOz(todayData.waterOz || 0);
    setCurrentMood(todayData.mood || null);
    setReflectionText(todayData.reflection || "");
  }, [habitData]);

  const formatTime = s => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;

  const toggleTask = useCallback((task) => {
    const nextValue = !todayData[task];
    const updatedDay = { ...todayData, [task]: nextValue };
    const completedNow = ["morning","night","floss"].filter(k => updatedDay[k]).length;
    setHabitData(prev => {
      const updated = { ...prev, [today]: updatedDay };
      if (completedNow === 3 && isRecoveryDay) updated[RECOVERY_KEY] = new Date().toISOString();
      return updated;
    });
    if (completedNow === 3) { setShowCompletion(true); setTimeout(() => setShowCompletion(false), 2800); }
  }, [todayData, today, isRecoveryDay, setHabitData]);

  const updateWater = (oz) => {
    const next = Math.max(0, Math.min(oz, WATER_GOAL_OZ + 32));
    setWaterOz(next);
    setHabitData(prev => ({ ...prev, [today]: { ...todayData, waterOz: next } }));
  };

  const saveMood = (moodKey) => {
    setCurrentMood(moodKey);
    setHabitData(prev => ({ ...prev, [today]: { ...todayData, mood: moodKey } }));
    setShowMoodModal(false);
  };

  const saveReflection = () => {
    setHabitData(prev => ({ ...prev, [today]: { ...todayData, reflection: reflectionText } }));
    setShowReflection(false);
  };

  const toggleTimer = () => {
    if (timerEnabled && activeTimer) {
      toggleTask(activeTimer);
      clearInterval(timerIntervalRef.current);
      setActiveTimer(null);
      setTimeLeft(BRUSH_TIME);
    }
    setTimerEnabled(p => !p);
  };

  useEffect(() => {
    if (!activeTimer) return;
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          toggleTask(activeTimer);
          setActiveTimer(null);
          return BRUSH_TIME;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
  }, [activeTimer, toggleTask]);

  const handleShare = async () => {
    const { current, longest } = calculateStreaks(habitData);
    const shareText = `🦷 SmileStreak Update!\n\n🔥 ${current} day streak\n✅ ${completedCount}/3 tasks done today\n📊 ${consistencyScore}% consistency this week\n⚡ ${streakMultiplier}x streak multiplier\n\nBuilding better dental habits one day at a time! 😁`;
    setShowShareModal(false);
    if (navigator.share) {
      try { await navigator.share({ title: "My SmileStreak Progress", text: shareText }); return; } catch {}
    }
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        return;
      } catch {}
    }
    // Final fallback
    const ta = document.createElement("textarea");
    ta.value = shareText;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const completedCount = ["morning","night","floss"].filter(k => todayData[k]).length;
  const percent = Math.round((completedCount / 3) * 100);
  const { current, longest } = calculateStreaks(habitData);
  const dayLabel = new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" });
  const tip = translatedTips[tipIndex];
  const waterPct = Math.min(100, (waterOz / WATER_GOAL_OZ) * 100);
  const cups = (waterOz / 8).toFixed(1);

  const motivations = [
    { emoji: "🌅", textKey: "Let's start your day right!" },
    { emoji: "⚡", textKey: "Great start — keep going!" },
    { emoji: "🎯", textKey: "Almost there, one more to go!" },
    { emoji: "🏆", textKey: "All done — you're unstoppable!" },
  ];
  const mot = motivations[completedCount];

  const remainingText = completedCount < 3
    ? `${3 - completedCount} ${T(3 - completedCount !== 1 ? "tasks remaining" : "task remaining")}`
    : `${T("All tasks complete today")} 🎊`;

  const currentMoodOption = MOOD_OPTIONS.find(m => m.labelKey === currentMood);
  const currentMoodTranslated = translatedMoods.find(m => m.labelKey === currentMood);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-50/30 to-white">
      <style>{`
        @keyframes fadeIn   { from{opacity:0}to{opacity:1} }
        @keyframes slideUp  { from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1} }
        @keyframes bounceIn { 0%{transform:scale(0.7);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1} }
        .af  { animation: fadeIn   .22s ease }
        .as  { animation: slideUp  .38s cubic-bezier(.22,1,.36,1) }
        .ab  { animation: bounceIn .45s cubic-bezier(.22,1,.36,1) }
        .press { transition: transform .14s ease }
        .press:active { transform: scale(.97) }
        .card      { background:white; border-radius:20px; border:1px solid #e0eeff; box-shadow:0 1px 3px rgba(59,130,246,.07),0 4px 16px rgba(59,130,246,.06); }
        .card-deep { background:white; border-radius:20px; border:1px solid #dbeafe; box-shadow:0 2px 8px rgba(59,130,246,.10),0 8px 24px rgba(59,130,246,.08); }
      `}</style>

      {/* Copied toast */}
      {copied && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 af">
          <div className="bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-2xl shadow-xl">
            ✅ Copied to clipboard!
          </div>
        </div>
      )}

      {/* Completion overlay */}
      {showCompletion && (
        <div className="fixed inset-0 bg-blue-900/25 backdrop-blur-sm flex items-center justify-center z-50 af">
          <div className="bg-white rounded-3xl px-10 py-9 text-center ab" style={{boxShadow:"0 24px 80px rgba(59,130,246,.22)",border:"1px solid #dbeafe"}}>
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-2xl font-bold text-gray-900 mb-2">{T("Day Complete!")}</p>
            <p className="text-sm text-gray-400 mb-3">{isRecoveryDay ? `🔄 ${T("Recovery streak saved!")}` : "✨ Perfect consistency!"}</p>
            {streakMultiplier > 1 && (
              <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
                ⚡ {streakMultiplier}x {T("Multiplier Active")}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/85 backdrop-blur-lg border-b border-blue-100/80" style={{boxShadow:"0 1px 12px rgba(59,130,246,.08)"}}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">🦷 {T("Today's Routine")}</h1>
            <p className="text-[11px] text-gray-400 mt-0.5">{dayLabel}</p>
          </div>
          <button onClick={() => setShowReflection(true)}
            className="p-2.5 rounded-xl bg-white border border-blue-100 text-gray-400 hover:text-red-400 hover:border-red-100 press"
            style={{boxShadow:"0 1px 4px rgba(0,0,0,.06)"}}>
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-3.5">

        {/* Motivation */}
        <div className="rounded-2xl px-5 py-4 flex items-center gap-4"
          style={{background:"linear-gradient(135deg,#3b82f6 0%,#60a5fa 100%)",boxShadow:"0 4px 20px rgba(59,130,246,.3)"}}>
          <span className="text-4xl">{mot.emoji}</span>
          <div>
            <p className="text-white font-bold text-sm">{T(mot.textKey)}</p>
            <p className="text-blue-100 text-xs mt-0.5">{remainingText}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { emoji:"🔥", val:`${current}d`,          labelKey:"Streak" },
            { emoji:"🏅", val:`${longest}d`,          labelKey:"Best"   },
            { emoji:"📈", val:`${consistencyScore}%`, labelKey:"Score"  },
            { emoji:"⚡", val:`${streakMultiplier}x`, labelKey:"Boost"  },
          ].map(s => (
            <div key={s.labelKey} className="card text-center p-3">
              <div className="text-xl mb-1">{s.emoji}</div>
              <div className="text-sm font-bold text-blue-600">{s.val}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{T(s.labelKey)}</div>
            </div>
          ))}
        </div>

        {/* Weekly chart */}
        <div className="card p-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">📅 {T("This Week")}</p>
          <div className="flex justify-between items-end gap-2">
            {weekDots.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex flex-col gap-0.5">
                  {[2,1,0].map(slot => (
                    <div key={slot} className={`h-1.5 rounded-full transition-all duration-500 ${d.done > slot ? "bg-blue-400" : "bg-blue-50"}`} />
                  ))}
                </div>
                <span className={`text-[10px] font-semibold ${d.isToday ? "text-blue-500" : "text-gray-300"}`}>{d.label}</span>
                {d.isToday && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Recovery */}
        {isRecoveryDay && (
          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-amber-200" style={{background:"#fffbeb"}}>
            <span className="text-2xl">🔄</span>
            <div>
              <p className="text-sm font-semibold text-amber-700">{T("Recovery Day!")}</p>
              <p className="text-xs text-amber-600 mt-0.5">{T("Complete all 3 tasks to restore your streak.")}</p>
            </div>
          </div>
        )}

        {/* Progress ring + timer toggle */}
        <div className="card px-4 py-3.5 flex items-center gap-4">
          <div className="relative w-14 h-14 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" stroke="#dbeafe" strokeWidth="5" />
              <circle cx="28" cy="28" r="22" fill="none" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round"
                strokeDasharray={`${2*Math.PI*22}`}
                strokeDashoffset={`${2*Math.PI*22*(1-percent/100)}`}
                style={{transition:"stroke-dashoffset .7s cubic-bezier(.4,0,.2,1)"}} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] font-bold text-blue-600">{percent}%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-sm">{T("Daily Tasks")}</p>
            <p className="text-xs text-gray-400">{completedCount} {T("of 3 completed")}</p>
          </div>
          <button onClick={toggleTimer}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold press transition-all"
            style={timerEnabled
              ? {background:"linear-gradient(135deg,#3b82f6,#60a5fa)",color:"white",boxShadow:"0 2px 10px rgba(59,130,246,.3)"}
              : {background:"#eff6ff",color:"#3b82f6",border:"1px solid #dbeafe"}}>
            <Clock className="w-3.5 h-3.5" />
            {timerEnabled ? T("Timer On") : T("Use Timer")}
          </button>
        </div>

        {/* Task cards */}
        <div className="space-y-2.5">
          {["morning","night"].map(task => {
            const isDone = todayData[task];
            const isRunning = activeTimer === task;
            const fillPct = isRunning ? ((BRUSH_TIME - timeLeft) / BRUSH_TIME) * 100 : 0;
            return (
              <button key={task} className="press w-full text-left"
                onClick={() => {
                  if (isDone) toggleTask(task);
                  else if (timerEnabled) { setActiveTimer(task); setTimeLeft(BRUSH_TIME); }
                  else toggleTask(task);
                }}>
                <div className="relative overflow-hidden rounded-2xl border p-4 transition-all duration-200"
                  style={isDone
                    ? {background:"linear-gradient(135deg,#eff6ff,#f0f9ff)",border:"1px solid #bfdbfe",boxShadow:"0 2px 12px rgba(59,130,246,.10)"}
                    : isRunning
                    ? {background:"white",border:"1px solid #93c5fd",boxShadow:"0 4px 20px rgba(59,130,246,.15)"}
                    : {background:"white",border:"1px solid #e0eeff",boxShadow:"0 1px 3px rgba(0,0,0,.05),0 4px 12px rgba(59,130,246,.06)"}}>
                  {isRunning && (
                    <div className="absolute inset-0 bg-blue-50 origin-left"
                      style={{transform:`scaleX(${fillPct/100})`,transition:"transform 1s linear"}} />
                  )}
                  <div className="relative flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{task === "morning" ? "🪥" : "🌙"}</span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {task === "morning" ? T("Morning Brushing") : T("Night Brushing")}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {isRunning ? `🔄 ${T("Brush in circular motions…")}` : isDone ? `✅ ${T("Completed")}` : `⏱️ ${T("2 minutes recommended")}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {isRunning ? (
                        <div className="text-white px-3 py-1.5 rounded-xl text-sm font-bold tabular-nums"
                          style={{background:"linear-gradient(135deg,#3b82f6,#60a5fa)",boxShadow:"0 2px 8px rgba(59,130,246,.3)"}}>
                          {formatTime(timeLeft)}
                        </div>
                      ) : isDone ? (
                        <div className="w-9 h-9 rounded-full flex items-center justify-center"
                          style={{background:"linear-gradient(135deg,#3b82f6,#60a5fa)",boxShadow:"0 2px 8px rgba(59,130,246,.25)"}}>
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full border-2 border-blue-100 flex items-center justify-center bg-white">
                          <Circle className="w-4 h-4 text-blue-200" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Floss */}
          <button className="press w-full text-left" onClick={() => toggleTask("floss")}>
            <div className="rounded-2xl border p-4 transition-all duration-200"
              style={todayData.floss
                ? {background:"linear-gradient(135deg,#eff6ff,#f0f9ff)",border:"1px solid #bfdbfe",boxShadow:"0 2px 12px rgba(59,130,246,.10)"}
                : {background:"white",border:"1px solid #e0eeff",boxShadow:"0 1px 3px rgba(0,0,0,.05),0 4px 12px rgba(59,130,246,.06)"}}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🧵</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{T("Interdental Care")}</p>
                    <select value={interdentalType} onChange={e => setInterdentalType(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      className="text-xs text-gray-400 bg-transparent border-none focus:outline-none p-0 mt-0.5 block cursor-pointer">
                      <option value="Floss">🧵 {T("Floss")}</option>
                      <option value="Water Pick">💦 {T("Water Pick")}</option>
                      <option value="Interdental Brush">🔹 {T("Interdental Brush")}</option>
                    </select>
                  </div>
                </div>
                {todayData.floss ? (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{background:"linear-gradient(135deg,#3b82f6,#60a5fa)",boxShadow:"0 2px 8px rgba(59,130,246,.25)"}}>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full border-2 border-blue-100 flex items-center justify-center flex-shrink-0 bg-white">
                    <Circle className="w-4 h-4 text-blue-200" />
                  </div>
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Water tracker */}
        <div className="card-deep p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-gray-900">💧 {T("Water Intake")}</p>
              <p className="text-xs text-gray-400 mt-0.5">{T("Goal: 64 fl oz · 8 cups · ~2 L")}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-blue-600">{waterOz} oz</span>
              <span className="text-xs text-gray-400 block">{cups} cups</span>
            </div>
          </div>
          <div className="h-2.5 bg-blue-50 rounded-full overflow-hidden mb-3" style={{boxShadow:"inset 0 1px 3px rgba(59,130,246,.10)"}}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{width:`${waterPct}%`,background:"linear-gradient(90deg,#60a5fa,#3b82f6)"}} />
          </div>
          <div className="flex gap-2">
            {[8,16,24].map(oz => (
              <button key={oz} onClick={() => updateWater(waterOz + oz)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold press border border-blue-100"
                style={{background:"#eff6ff",color:"#2563eb"}}>
                +{oz} oz
              </button>
            ))}
            <button onClick={() => updateWater(waterOz - 8)}
              className="px-4 py-2.5 rounded-xl text-sm font-bold press text-gray-400 border border-gray-100 bg-gray-50">
              −
            </button>
          </div>
          {waterOz >= WATER_GOAL_OZ && (
            <p className="text-xs text-blue-500 font-semibold mt-3 text-center">🎉 {T("Daily hydration goal reached!")}</p>
          )}
        </div>

        {/* Mood */}
        <div className="card p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900">😊 {T("Today's Mood")}</p>
            <p className="text-xs text-gray-400 mt-0.5">{T("How are you feeling?")}</p>
          </div>
          {currentMood ? (
            <button onClick={() => setShowMoodModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-100 press" style={{background:"#eff6ff"}}>
              <span className="text-xl">{currentMoodOption?.emoji}</span>
              <span className="text-xs font-semibold text-blue-600">{currentMoodTranslated?.label ?? currentMood}</span>
            </button>
          ) : (
            <button onClick={() => setShowMoodModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-blue-100 press hover:opacity-80"
              style={{background:"#eff6ff",color:"#2563eb"}}>
              + {T("Log mood")}
            </button>
          )}
        </div>

        {/* Milestone */}
        {streakMilestones.length > 0 && streakMilestones[0].remaining > 0 && (
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-gray-900">🏁 {T("Next Milestone")}</p>
              <span className="text-xs font-semibold text-blue-500">{current} → {streakMilestones[0].next} days</span>
            </div>
            <div className="h-2.5 bg-blue-50 rounded-full overflow-hidden" style={{boxShadow:"inset 0 1px 3px rgba(59,130,246,.10)"}}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{width:`${Math.min(100,(current/streakMilestones[0].next)*100)}%`,background:"linear-gradient(90deg,#60a5fa,#3b82f6)"}} />
            </div>
            <p className="text-xs text-gray-400 mt-2">{streakMilestones[0].remaining} {T("days to go — keep it up!")} 💪</p>
          </div>
        )}

        {/* Tip of the day */}
        <div className="rounded-2xl p-4" style={{background:"linear-gradient(135deg,#2563eb,#3b82f6,#60a5fa)",boxShadow:"0 4px 20px rgba(59,130,246,.28)"}}>
          <p className="text-[11px] font-bold text-blue-100 uppercase tracking-wider mb-2.5">✨ {T("Tip of the Day")}</p>
          <div className="flex gap-3 items-start">
            <span className="text-2xl">{tip.icon}</span>
            <div>
              <p className="text-sm font-bold text-white">{tip.title}</p>
              <p className="text-xs text-blue-100 mt-1 leading-relaxed">{tip.body}</p>
            </div>
          </div>
        </div>

        {/* Tips accordion */}
        <div className="card overflow-hidden">
          <button className="w-full p-4 flex items-center justify-between press" onClick={() => setTipsOpen(!tipsOpen)}>
            <div className="flex items-center gap-2">
              <span>🪥</span>
              <p className="text-sm font-bold text-gray-900">{T("All Brushing Tips")}</p>
            </div>
            <span className="text-gray-300 text-xl leading-none font-light">{tipsOpen ? "−" : "+"}</span>
          </button>
          {tipsOpen && (
            <div className="px-4 pb-4 border-t border-blue-50 pt-3 space-y-3.5 as">
              {translatedTips.map((tip, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-xl mt-0.5">{tip.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-gray-700">{tip.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{tip.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reflection note */}
        {reflectionText && (
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">💭 {T("Today's Note")}</p>
              <button onClick={() => setShowReflection(true)} className="text-xs text-blue-400 font-semibold press">{T("Edit")}</button>
            </div>
            <p className="text-sm text-gray-600 italic leading-relaxed">"{reflectionText}"</p>
          </div>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <div className="card p-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">🏅 {T("Achievements")}</p>
            <div className="flex flex-wrap gap-2">
              {badges.map((b, i) => {
                const meta = BADGE_META[b] || { emoji:"⭐", bg:"bg-blue-50", text:"text-blue-700", border:"border-blue-100" };
                return (
                  <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${meta.bg} ${meta.text} rounded-xl text-xs font-semibold border ${meta.border}`}>
                    {meta.emoji} {translatedBadgeNames[b] ?? b}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Share button */}
        <button onClick={handleShare}
          className="press w-full py-4 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2"
          style={{background:"linear-gradient(135deg,#3b82f6,#60a5fa)",boxShadow:"0 4px 16px rgba(59,130,246,.28)"}}>
          <Share2 className="w-4 h-4" />
          📤 {T("Share Your Progress")}
        </button>
      </div>

      {/* ── Modals ── */}

      {/* Reflection */}
      {showReflection && (
        <div className="fixed inset-0 bg-blue-900/25 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 af"
          onClick={() => setShowReflection(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 as"
            style={{boxShadow:"0 -8px 40px rgba(59,130,246,.15)"}}
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden" />
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-bold text-gray-900">{T("Daily Reflection")}</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">{T("Jot down a thought about your routine today.")}</p>
            <textarea value={reflectionText} onChange={e => setReflectionText(e.target.value)}
              placeholder={T("How did brushing feel today? Anything to improve?…")}
              className="w-full p-4 border border-blue-100 rounded-2xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[110px] resize-none"
              style={{boxShadow:"inset 0 1px 4px rgba(59,130,246,.07)"}} />
            <div className="flex gap-2 mt-4">
              <button onClick={saveReflection}
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white press"
                style={{background:"linear-gradient(135deg,#3b82f6,#60a5fa)"}}>
                💾 {T("Save")}
              </button>
              <button onClick={() => setShowReflection(false)}
                className="flex-1 py-3.5 bg-gray-100 text-gray-500 rounded-2xl text-sm font-semibold hover:bg-gray-200 press">
                {T("Cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mood */}
      {showMoodModal && (
        <div className="fixed inset-0 bg-blue-900/25 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 af"
          onClick={() => setShowMoodModal(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 as"
            style={{boxShadow:"0 -8px 40px rgba(59,130,246,.15)"}}
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden" />
            <h3 className="text-lg font-bold text-gray-900 mb-4">{T("How are you feeling?")} 😊</h3>
            <div className="grid grid-cols-3 gap-2.5">
              {translatedMoods.map(m => (
                <button key={m.labelKey} onClick={() => saveMood(m.labelKey)}
                  className="p-4 rounded-2xl border text-center press transition-all"
                  style={currentMood === m.labelKey
                    ? {background:"#eff6ff",border:"1px solid #93c5fd"}
                    : {background:"white",border:"1px solid #f0f0f0"}}>
                  <div className="text-2xl mb-1.5">{m.emoji}</div>
                  <div className="text-xs text-gray-500 font-semibold">{m.label}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowMoodModal(false)}
              className="w-full mt-4 py-3 text-sm text-gray-400 hover:bg-gray-50 rounded-2xl press">
              {T("Close")}
            </button>
          </div>
        </div>
      )}

      {/* Share modal (shown if Web Share unavailable) */}
      {showShareModal && (
        <div className="fixed inset-0 bg-blue-900/25 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 af"
          onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 as"
            style={{boxShadow:"0 -8px 40px rgba(59,130,246,.15)"}}
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden" />
            <div className="text-center mb-5">
              <div className="text-4xl mb-2">📤</div>
              <h3 className="text-lg font-bold text-gray-900">{T("Share Your Progress")}</h3>
              <p className="text-xs text-gray-400 mt-1">🔥 {current} day streak · ✅ {completedCount}/3 today · 📊 {consistencyScore}% this week</p>
            </div>
            <button onClick={handleShare}
              className="w-full py-4 rounded-2xl text-sm font-bold text-white press flex items-center justify-center gap-2"
              style={{background:"linear-gradient(135deg,#3b82f6,#60a5fa)",boxShadow:"0 4px 16px rgba(59,130,246,.3)"}}>
              <Share2 className="w-4 h-4" /> {T("Share with Friends")}
            </button>
            <button onClick={() => setShowShareModal(false)}
              className="w-full mt-2.5 py-3 text-sm text-gray-400 hover:bg-gray-50 rounded-2xl press">
              {T("Close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

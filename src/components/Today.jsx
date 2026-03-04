import { useEffect, useState, useContext, useRef } from "react";
import { getDateKey, getYesterdayKey } from "../utils/date.js";
import { calculateStreaks } from "../utils/streak.js";
import {
  Clock, CheckCircle2, Circle, Sparkles, Share2,
  Flame, Trophy, Target, Zap, Award, Heart, Smile, Crown, Droplets
} from "lucide-react";
import { TranslationContext } from "../App";

const BRUSH_TIME = 120;
const RECOVERY_KEY = "__lastRecoveryUsed";

const DENTAL_TIPS = [
  { title: "Circular Motion", body: "Use small circular strokes rather than scrubbing — it's gentler on enamel and reaches the gum line better.", icon: "🔄" },
  { title: "45° Angle", body: "Tilt your brush at 45° to the gum line. This lets the bristles slip just under the gums where plaque hides.", icon: "📐" },
  { title: "Two Full Minutes", body: "Spend 30 seconds per quadrant. Most people only brush for 45 seconds — a timer makes a real difference.", icon: "⏱️" },
  { title: "Brush Your Tongue", body: "Your tongue harbours bacteria that cause bad breath. Give it a gentle brush or use a scraper each time.", icon: "👅" },
  { title: "Wait After Eating", body: "Wait 30 minutes after meals before brushing. Acidic food softens enamel and brushing too soon can wear it away.", icon: "🍎" },
  { title: "Stay Hydrated", body: "Water washes away food particles and prevents dry mouth, which is a leading cause of cavities.", icon: "💧" },
  { title: "Replace Your Brush", body: "Swap your toothbrush every 3–4 months or when bristles start to splay — a worn brush cleans far less effectively.", icon: "🪥" },
  { title: "Floss First", body: "Flossing before you brush loosens debris between teeth so your toothpaste can reach those surfaces too.", icon: "🧵" },
];

const MOOD_OPTIONS = [
  { emoji: "🤩", label: "Energised" },
  { emoji: "😊", label: "Good" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😴", label: "Tired" },
  { emoji: "😐", label: "Meh" },
  { emoji: "😷", label: "Unwell" },
];

const BADGE_META = {
  "Week Warrior":   { emoji: "🛡️", from: "from-blue-100", text: "text-blue-700" },
  "Monthly Master": { emoji: "👑", from: "from-yellow-100", text: "text-yellow-700" },
  "Century Club":   { emoji: "🏆", from: "from-purple-100", text: "text-purple-700" },
  "Perfect Week":   { emoji: "✨", from: "from-green-100", text: "text-green-700" },
  "Perfect Month":  { emoji: "🌟", from: "from-pink-100", text: "text-pink-700" },
};

export default function Today({ habitData, setHabitData }) {
  const { t, currentLanguage } = useContext(TranslationContext);
  const [texts, setTexts] = useState({});
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

  const today = getDateKey();
  const yesterday = getYesterdayKey(today);
  const todayData = habitData[today] || { morning: false, night: false, floss: false, reflection: null, mood: null, waterOz: 0 };
  const yesterdayData = habitData[yesterday];
  const lastRecovery = habitData[RECOVERY_KEY];
  const lastRecoveryDate = lastRecovery ? new Date(lastRecovery) : null;
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recoveryAvailable = !lastRecoveryDate || lastRecoveryDate < oneWeekAgo;
  const missedYesterday = yesterdayData && ["morning", "night", "floss"].some(t => yesterdayData[t] === false);
  const isRecoveryDay = missedYesterday && recoveryAvailable;

  const [activeTimer, setActiveTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(BRUSH_TIME);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [interdentalType, setInterdentalType] = useState("Floss");
  const [, forceUpdate] = useState(0);
  const timerIntervalRef = useRef(null);

  useEffect(() => { forceUpdate(v => v + 1); }, [habitData]);
  useEffect(() => { setTipIndex(new Date().getDate() % DENTAL_TIPS.length); }, []);

  useEffect(() => {
    const run = async () => {
      setTexts({ dayComplete: await t("Day Complete!"), recoverySaved: await t("Recovery streak saved!") });
    };
    run();
  }, [currentLanguage, t]);

  useEffect(() => {
    const dots = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = getDateKey(d);
      const day = habitData[key];
      const done = day ? ["morning","night","floss"].filter(k => day[k]).length : 0;
      dots.push({ label: d.toLocaleDateString("en-US",{weekday:"short"}).slice(0,1), done, isToday: i===0 });
    }
    setWeekDots(dots);

    const scores = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const day = habitData[getDateKey(d)];
      if (day) scores.push(["morning","night","floss"].filter(k=>day[k]).length/3);
    }
    setConsistencyScore(Math.round(scores.reduce((a,b)=>a+b,0)/7*100)||0);

    const { current, longest } = calculateStreaks(habitData);
    setStreakMultiplier(current>=30?2:current>=14?1.5:current>=7?1.25:1);

    const nb = [];
    if (longest>=7) nb.push("Week Warrior");
    if (longest>=30) nb.push("Monthly Master");
    if (longest>=100) nb.push("Century Club");
    let pw=true;
    for(let i=0;i<7;i++){const d=new Date();d.setDate(d.getDate()-i);const day=habitData[getDateKey(d)];if(!day||!day.morning||!day.night||!day.floss){pw=false;break;}}
    if(pw) nb.push("Perfect Week");
    let pm=true;
    for(let i=0;i<30;i++){const d=new Date();d.setDate(d.getDate()-i);const day=habitData[getDateKey(d)];if(!day||!day.morning||!day.night||!day.floss){pm=false;break;}}
    if(pm) nb.push("Perfect Month");
    setBadges(nb);

    const milestones=[7,30,60,90,180,365];
    const next=milestones.find(m=>m>current)||365;
    setStreakMilestones([{current,next,remaining:next-current}]);

    setWaterOz(todayData.waterOz||0);
    setCurrentMood(todayData.mood||null);
    setReflectionText(todayData.reflection||"");
  }, [habitData]);

  const formatTime = s => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;

  const toggleTask = (task) => {
    const nextValue = !todayData[task];
    const updatedDay = { ...todayData, [task]: nextValue };
    const completedNow = ["morning","night","floss"].filter(k => updatedDay[k]).length;

    setHabitData(prev => {
      const updated = { ...prev, [today]: updatedDay };
      if (completedNow === 3 && isRecoveryDay) updated[RECOVERY_KEY] = new Date().toISOString();
      return updated;
    });

    if (completedNow === 3) {
      setShowCompletion(true);
      setTimeout(() => setShowCompletion(false), 2500);
    }
  };

  const updateWater = (oz) => {
    const next = Math.max(0, oz);
    setWaterOz(next);
    setHabitData(prev => ({ ...prev, [today]: { ...todayData, waterOz: next } }));
  };

  const saveMood = (mood) => {
    setCurrentMood(mood);
    setHabitData(prev => ({ ...prev, [today]: { ...todayData, mood } }));
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
    setTimerEnabled(!timerEnabled);
  };

  useEffect(() => {
    if (!activeTimer) return;
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerIntervalRef.current); toggleTask(activeTimer); setActiveTimer(null); return BRUSH_TIME; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
  }, [activeTimer]);

  const completedCount = ["morning","night","floss"].filter(k => todayData[k]).length;
  const percent = Math.round((completedCount/3)*100);
  const { current, longest } = calculateStreaks(habitData);
  const dayLabel = new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
  const tip = DENTAL_TIPS[tipIndex];

  const motivations = [
    { emoji: "🌅", text: "Let's start your day right!" },
    { emoji: "⚡", text: "Great start — keep going!" },
    { emoji: "🎯", text: "Almost there, one more to go!" },
    { emoji: "🏆", text: "All done — you're unstoppable!" },
  ];
  const mot = motivations[completedCount];

  // Water goal: 64 oz (8 cups × 8 oz)
  const WATER_GOAL_OZ = 64;
  const waterPct = Math.min(100, (waterOz / WATER_GOAL_OZ) * 100);
  const cups = (waterOz / 8).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <style>{`
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }
        @keyframes slideUp { from{transform:translateY(22px);opacity:0}to{transform:translateY(0);opacity:1} }
        @keyframes scaleIn { from{transform:scale(0.91);opacity:0}to{transform:scale(1);opacity:1} }
        @keyframes popIn { 0%{transform:scale(0.8);opacity:0}65%{transform:scale(1.06)}100%{transform:scale(1);opacity:1} }
        .af{animation:fadeIn .25s ease}
        .as{animation:slideUp .35s cubic-bezier(.22,1,.36,1)}
        .ac{animation:scaleIn .28s cubic-bezier(.22,1,.36,1)}
        .ap{animation:popIn .38s cubic-bezier(.22,1,.36,1)}
        .tp{transition:all .18s ease}
        .tp:active{transform:scale(.975)}
      `}</style>

      {/* Completion overlay */}
      {showCompletion && (
        <div className="fixed inset-0 bg-blue-900/20 backdrop-blur-sm flex items-center justify-center z-50 af">
          <div className="bg-white rounded-3xl px-10 py-8 shadow-2xl border border-blue-100 ac text-center">
            <div className="text-5xl mb-3">🎉</div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{texts.dayComplete || "Day Complete!"}</p>
            <p className="text-sm text-gray-400">{isRecoveryDay ? "🔄 Recovery streak saved!" : "✨ Perfect consistency!"}</p>
            {streakMultiplier > 1 && (
              <span className="mt-3 inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                ⚡ {streakMultiplier}x Multiplier Active
              </span>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">🦷 Today's Routine</h1>
            <p className="text-[11px] text-gray-400 mt-0.5">{dayLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowReflection(true)}
              className="p-2 rounded-xl bg-white border border-blue-100 text-gray-400 hover:text-red-400 hover:border-red-100 tp">
              <Heart className="w-4 h-4" />
            </button>
            <button onClick={toggleTimer}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium tp ${
                timerEnabled ? "bg-blue-500 text-white shadow-md shadow-blue-100" : "bg-white border border-blue-100 text-gray-500"
              }`}>
              <Clock className="w-3.5 h-3.5" />
              {timerEnabled ? "On" : "Timer"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-3.5">

        {/* Motivation banner */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-md shadow-blue-100">
          <span className="text-4xl">{mot.emoji}</span>
          <div>
            <p className="text-white font-semibold text-sm">{mot.text}</p>
            <p className="text-blue-100 text-xs mt-0.5">
              {completedCount < 3 ? `${3 - completedCount} task${3 - completedCount !== 1 ? "s" : ""} left` : "All tasks complete today 🎊"}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { emoji: "🔥", val: `${current}d`, label: "Streak" },
            { emoji: "🏅", val: `${longest}d`, label: "Best" },
            { emoji: "📈", val: `${consistencyScore}%`, label: "Score" },
            { emoji: "⚡", val: `${streakMultiplier}x`, label: "Boost" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-3 border border-blue-50 shadow-sm text-center">
              <div className="text-lg mb-0.5">{s.emoji}</div>
              <div className="text-sm font-bold text-blue-600">{s.val}</div>
              <div className="text-[10px] text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Weekly bar chart */}
        <div className="bg-white rounded-2xl p-4 border border-blue-50 shadow-sm">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">📅 This Week</p>
          <div className="flex justify-between items-end gap-1.5">
            {weekDots.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col gap-0.5">
                  {[2,1,0].map(slot => (
                    <div key={slot} className={`h-1.5 rounded-full ${d.done > slot ? "bg-blue-400" : "bg-blue-50"}`} />
                  ))}
                </div>
                <span className={`text-[10px] font-semibold ${d.isToday ? "text-blue-500" : "text-gray-300"}`}>{d.label}</span>
                {d.isToday && <div className="w-1 h-1 rounded-full bg-blue-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Recovery */}
        {isRecoveryDay && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center gap-3">
            <span className="text-2xl">🔄</span>
            <div>
              <p className="text-sm font-semibold text-amber-700">Recovery Day!</p>
              <p className="text-xs text-amber-600 mt-0.5">Complete all 3 tasks to restore your streak.</p>
            </div>
          </div>
        )}

        {/* Progress ring + label */}
        <div className="flex items-center gap-3 px-1">
          <div className="relative w-12 h-12 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="19" fill="none" stroke="#dbeafe" strokeWidth="4.5" />
              <circle cx="24" cy="24" r="19" fill="none" stroke="#3b82f6" strokeWidth="4.5" strokeLinecap="round"
                strokeDasharray={`${2*Math.PI*19}`}
                strokeDashoffset={`${2*Math.PI*19*(1-percent/100)}`}
                style={{transition:"stroke-dashoffset .7s cubic-bezier(.4,0,.2,1)"}} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-blue-600">{percent}%</span>
            </div>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Daily Tasks</p>
            <p className="text-xs text-gray-400">{completedCount} of 3 completed</p>
          </div>
        </div>

        {/* Task cards */}
        <div className="space-y-2.5">
          {["morning","night"].map(task => {
            const isDone = todayData[task];
            const isRunning = activeTimer === task;
            const fillPct = isRunning ? ((BRUSH_TIME - timeLeft) / BRUSH_TIME) * 100 : 0;
            return (
              <button key={task} className="tp w-full text-left"
                onClick={() => {
                  if (isDone) toggleTask(task);
                  else if (timerEnabled) { setActiveTimer(task); setTimeLeft(BRUSH_TIME); }
                  else toggleTask(task);
                }}>
                <div className={`relative overflow-hidden rounded-2xl border p-4 ${
                  isDone ? "bg-blue-50 border-blue-200" :
                  isRunning ? "bg-white border-blue-300 shadow-md shadow-blue-50" :
                  "bg-white border-gray-100 shadow-sm hover:border-blue-200"
                }`}>
                  {isRunning && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent origin-left"
                      style={{transform:`scaleX(${fillPct/100})`,transition:"transform 1s linear"}} />
                  )}
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{task==="morning"?"🌅":"🌙"}</span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {task==="morning"?"Morning Brushing":"Night Brushing"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {isRunning ? "🔄 Brush in circular motions…" : isDone ? "✅ Completed" : "⏱️ 2 minutes"}
                        </p>
                      </div>
                    </div>
                    {isRunning ? (
                      <div className="bg-blue-500 text-white px-3 py-1.5 rounded-xl text-sm font-bold tabular-nums">
                        {formatTime(timeLeft)}
                      </div>
                    ) : isDone ? (
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full border-2 border-blue-100 flex items-center justify-center">
                        <Circle className="w-4 h-4 text-blue-200" />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Floss */}
          <button className="tp w-full text-left" onClick={() => toggleTask("floss")}>
            <div className={`rounded-2xl border p-4 ${
              todayData.floss ? "bg-blue-50 border-blue-200" : "bg-white border-gray-100 shadow-sm hover:border-blue-200"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🧵</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Interdental Care</p>
                    <select value={interdentalType} onChange={e => setInterdentalType(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      className="text-xs text-gray-400 bg-transparent border-none focus:outline-none p-0 mt-0.5 block cursor-pointer">
                      <option>🧵 Floss</option>
                      <option>💦 Water Pick</option>
                      <option>🔹 Interdental Brush</option>
                    </select>
                  </div>
                </div>
                {todayData.floss ? (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-blue-100 flex items-center justify-center">
                    <Circle className="w-4 h-4 text-blue-200" />
                  </div>
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Water tracker */}
        <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">💧 Water Intake</p>
              <p className="text-xs text-gray-400">Goal: 64 fl oz · 8 cups · ~2 L</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-blue-600">{waterOz} oz</span>
              <span className="text-xs text-gray-400 block">{cups} cups</span>
            </div>
          </div>
          <div className="h-2 bg-blue-50 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-500"
              style={{width:`${waterPct}%`}} />
          </div>
          <div className="flex gap-2">
            {[8,16,24].map(oz => (
              <button key={oz} onClick={() => updateWater(waterOz + oz)}
                className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 tp">
                +{oz} oz
              </button>
            ))}
            <button onClick={() => updateWater(Math.max(0, waterOz - 8))}
              className="px-3 py-2 rounded-xl bg-gray-50 text-gray-400 text-xs font-semibold hover:bg-gray-100 tp">
              −
            </button>
          </div>
          {waterOz >= WATER_GOAL_OZ && (
            <p className="text-xs text-blue-500 font-medium mt-2.5 text-center">🎉 Daily hydration goal reached!</p>
          )}
        </div>

        {/* Mood tracker */}
        <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">😊 Today's Mood</p>
              <p className="text-xs text-gray-400">How are you feeling?</p>
            </div>
            {currentMood ? (
              <button onClick={() => setShowMoodModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl tp">
                <span className="text-xl">{MOOD_OPTIONS.find(m=>m.label===currentMood)?.emoji}</span>
                <span className="text-xs font-medium text-blue-600">{currentMood}</span>
              </button>
            ) : (
              <button onClick={() => setShowMoodModal(true)}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-xl hover:bg-blue-100 tp">
                + Log mood
              </button>
            )}
          </div>
        </div>

        {/* Milestone */}
        {streakMilestones.length > 0 && streakMilestones[0].remaining > 0 && (
          <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-900">🏁 Next Milestone</p>
              <span className="text-xs text-blue-500 font-medium">{current} → {streakMilestones[0].next} days</span>
            </div>
            <div className="h-2 bg-blue-50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-700"
                style={{width:`${Math.min(100,(current/streakMilestones[0].next)*100)}%`}} />
            </div>
            <p className="text-xs text-gray-400 mt-2">{streakMilestones[0].remaining} days to go — keep it up! 💪</p>
          </div>
        )}

        {/* Tip of the day */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-2xl p-4 shadow-md shadow-blue-100">
          <p className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider mb-2">✨ Tip of the Day</p>
          <div className="flex gap-3 items-start">
            <span className="text-2xl mt-0.5">{tip.icon}</span>
            <div>
              <p className="text-sm font-semibold text-white">{tip.title}</p>
              <p className="text-xs text-blue-100 mt-1 leading-relaxed">{tip.body}</p>
            </div>
          </div>
        </div>

        {/* Brushing tips accordion */}
        <div className="bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden">
          <button className="w-full p-4 flex items-center justify-between tp" onClick={() => setTipsOpen(!tipsOpen)}>
            <div className="flex items-center gap-2">
              <span className="text-base">🪥</span>
              <p className="text-sm font-semibold text-gray-900">All Brushing Tips</p>
            </div>
            <span className="text-gray-300 text-xl font-light leading-none">{tipsOpen ? "−" : "+"}</span>
          </button>
          {tipsOpen && (
            <div className="px-4 pb-4 border-t border-blue-50 pt-3 space-y-3">
              {DENTAL_TIPS.map((t, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-xl mt-0.5">{t.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{t.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{t.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reflection note (if saved) */}
        {reflectionText && (
          <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">💭 Today's Note</p>
              <button onClick={() => setShowReflection(true)} className="text-xs text-blue-400 tp">Edit</button>
            </div>
            <p className="text-sm text-gray-600 italic leading-relaxed">"{reflectionText}"</p>
          </div>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">🏅 Achievements</p>
            <div className="flex flex-wrap gap-2">
              {badges.map((b, i) => {
                const meta = BADGE_META[b] || { emoji: "⭐", from: "from-blue-100", text: "text-blue-700" };
                return (
                  <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${meta.from} to-white ${meta.text} rounded-xl text-xs font-semibold border border-white`}>
                    {meta.emoji} {b}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Share */}
        <button onClick={() => setShowShareModal(true)}
          className="w-full py-3.5 bg-white border border-blue-100 rounded-2xl text-sm font-medium text-gray-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-sm tp">
          <Share2 className="w-4 h-4 text-blue-400" />
          📤 Share Your Progress
        </button>
      </div>

      {/* Reflection modal */}
      {showReflection && (
        <div className="fixed inset-0 bg-blue-900/20 flex items-end sm:items-center justify-center z-50 af"
          onClick={() => setShowReflection(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 as shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden" />
            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" /> Daily Reflection
            </h3>
            <p className="text-xs text-gray-400 mb-4">Jot down a thought about your routine today.</p>
            <textarea value={reflectionText} onChange={e => setReflectionText(e.target.value)}
              placeholder="How did brushing feel today? Anything to improve?…"
              className="w-full p-3.5 border border-blue-100 rounded-2xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[110px] resize-none" />
            <div className="flex gap-2 mt-4">
              <button onClick={saveReflection}
                className="flex-1 py-3 bg-blue-500 text-white rounded-2xl text-sm font-semibold hover:bg-blue-600 tp">
                💾 Save
              </button>
              <button onClick={() => setShowReflection(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-2xl text-sm font-semibold hover:bg-gray-200 tp">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mood modal */}
      {showMoodModal && (
        <div className="fixed inset-0 bg-blue-900/20 flex items-end sm:items-center justify-center z-50 af"
          onClick={() => setShowMoodModal(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 as shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden" />
            <h3 className="text-lg font-bold text-gray-900 mb-4">How are you feeling? 😊</h3>
            <div className="grid grid-cols-3 gap-2.5">
              {MOOD_OPTIONS.map(m => (
                <button key={m.label} onClick={() => saveMood(m.label)}
                  className={`p-3.5 rounded-2xl border text-center tp ${
                    currentMood===m.label ? "bg-blue-50 border-blue-300" : "bg-white border-gray-100 hover:border-blue-200"
                  }`}>
                  <div className="text-2xl mb-1">{m.emoji}</div>
                  <div className="text-xs text-gray-500 font-medium">{m.label}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowMoodModal(false)}
              className="w-full mt-4 py-3 text-sm text-gray-400 hover:bg-gray-50 rounded-2xl tp">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Share modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-blue-900/20 flex items-end sm:items-center justify-center z-50 af"
          onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 as shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden" />
            <div className="text-center mb-5">
              <div className="text-4xl mb-2">📤</div>
              <h3 className="text-lg font-bold text-gray-900">Share Your Progress</h3>
              <p className="text-xs text-gray-400 mt-1">
                🔥 {current} day streak &nbsp;·&nbsp; ✅ {completedCount}/3 today &nbsp;·&nbsp; 📊 {consistencyScore}% this week
              </p>
            </div>
            <button className="w-full py-3.5 bg-blue-500 text-white rounded-2xl text-sm font-semibold hover:bg-blue-600 tp flex items-center justify-center gap-2 shadow-md shadow-blue-100">
              <Share2 className="w-4 h-4" /> Share with Friends
            </button>
            <button onClick={() => setShowShareModal(false)}
              className="w-full mt-2.5 py-3 text-sm text-gray-400 hover:bg-gray-50 rounded-2xl tp">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

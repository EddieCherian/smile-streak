import { scheduleDailyNotifications } from "../utils/scheduleNotifications";
import { useState, useEffect, useContext } from "react";
import { getReminders, saveReminders } from "../utils/reminders";
import { requestNotificationPermission } from "../utils/notifications";
import { Bell, BellOff, Clock, Sparkles, Zap, CheckCircle2, TrendingUp, Moon, Sun, Activity } from "lucide-react";
import { TranslationContext } from "../App";

const isIOS = /iPhone|iPad|iPo/.test(navigator.userAgent);

export default function Reminders() {
  const { t, currentLanguage, translating } = useContext(TranslationContext);
  
  const [reminders, setReminders] = useState(getReminders());
  const [message, setMessage] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderStats, setReminderStats] = useState({
    onTimeCount: 0,
    streak: 0
  });
  const [translatedText, setTranslatedText] = useState({});

  // Translation keys
  const translationKeys = {
    title: "Reminders",
    subtitle: "Stay on track with smart notifications",
    notificationsActive: "Notifications Active",
    notificationsActiveDesc: "You'll receive reminders at your scheduled times",
    enableNotifications: "Enable Notifications",
    enableNotificationsDesc: "Get reminded when it's time to brush and floss",
    quickSetup: "Quick Setup",
    morning: "Morning",
    night: "Night",
    floss: "Floss",
    onTimeActions: "On-Time Actions",
    onTimeActionsDesc: "Times you acted on reminders",
    reminderStreak: "Reminder Streak",
    reminderStreakDesc: "Consecutive days",
    customTimes: "Custom Times",
    morningBrush: "Morning Brush",
    nightBrush: "Night Brush",
    flossTime: "Floss Time",
    enableButton: "Enable Notifications",
    tipsTitle: "Reminder Tips",
    tip1: "• Set reminders 30 minutes before meals for best results",
    tip2: "• Night reminders work best 1 hour before bed",
    tip3: "• Consistent timing builds stronger habits",
    iosTitle: "iPhone Users",
    iosMessage: "Safari doesn't support web notifications. Add SmileStreak to your home screen for the best experience!",
    iosNotificationMessage: "📱 Notifications not supported on iPhone. Please use Safari's Add to Home Screen feature for reminders.",
    notificationsEnabled: "✅ Notifications enabled successfully!",
    notificationsBlocked: "❌ Notifications blocked. Please enable in browser settings.",
    morningSet: "⏰ Morning reminder set to 8:00 AM",
    nightSet: "🌙 Night reminder set to 9:00 PM",
    flossSet: "🧵 Floss reminder set to 8:30 PM"
  };

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      const translations = {};
      for (const [key, value] of Object.entries(translationKeys)) {
        translations[key] = await t(value);
      }
      setTranslatedText(translations);
    };
    
    loadTranslations();
  }, [currentLanguage, t]);

  useEffect(() => {
    saveReminders(reminders);
  }, [reminders]);

  useEffect(() => {
    // Load reminder stats from localStorage
    const stats = JSON.parse(localStorage.getItem('reminderStats') || '{"onTimeCount": 0, "streak": 0}');
    setReminderStats(stats);

    // Check if notifications are enabled
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const updateTime = (key, value) => {
    setReminders((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNotifications = async () => {
    if (isIOS) {
      setMessage(translatedText.iosNotificationMessage || translationKeys.iosNotificationMessage);
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    const permission = await requestNotificationPermission();

    if (permission === "granted") {
      scheduleDailyNotifications();
      setNotificationsEnabled(true);
      setMessage(translatedText.notificationsEnabled || translationKeys.notificationsEnabled);
      setTimeout(() => setMessage(""), 3000);
    } else if (permission === "denied") {
      setMessage(translatedText.notificationsBlocked || translationKeys.notificationsBlocked);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const quickSetMorning = () => {
    updateTime("morning", "08:00");
    setMessage(translatedText.morningSet || translationKeys.morningSet);
    setTimeout(() => setMessage(""), 2000);
  };

  const quickSetNight = () => {
    updateTime("night", "21:00");
    setMessage(translatedText.nightSet || translationKeys.nightSet);
    setTimeout(() => setMessage(""), 2000);
  };

  const quickSetFloss = () => {
    updateTime("floss", "20:30");
    setMessage(translatedText.flossSet || translationKeys.flossSet);
    setTimeout(() => setMessage(""), 2000);
  };

  // Show loading state while translating
  if (translating || Object.keys(translatedText).length === 0) {
    return (
      <section className="space-y-6 pb-8">
        <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl">
          <div className="animate-pulse flex items-center gap-2">
            <Bell className="w-6 h-6" />
            <h2 className="text-2xl font-black">Loading...</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-6 h-6" />
            <h2 className="text-2xl font-black">{translatedText.title}</h2>
          </div>
          <p className="text-sm opacity-90">{translatedText.subtitle}</p>
        </div>
      </div>

      {/* Notification Status */}
      <div className={`rounded-2xl p-5 border-2 ${
        notificationsEnabled 
          ? "bg-green-50 border-green-300" 
          : "bg-orange-50 border-orange-300"
      }`}>
        <div className="flex items-center gap-3">
          {notificationsEnabled ? (
            <>
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">{translatedText.notificationsActive}</p>
                <p className="text-xs text-gray-600">{translatedText.notificationsActiveDesc}</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <BellOff className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">{translatedText.enableNotifications}</p>
                <p className="text-xs text-gray-600">{translatedText.enableNotificationsDesc}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl p-5 shadow-lg border border-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">{translatedText.quickSetup}</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={quickSetMorning}
            className="group p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <Sun className="w-6 h-6 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-semibold text-gray-700">{translatedText.morning}</p>
            <p className="text-xs text-gray-500">8:00 AM</p>
          </button>
          
          <button
            onClick={quickSetNight}
            className="group p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <Moon className="w-6 h-6 text-indigo-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-semibold text-gray-700">{translatedText.night}</p>
            <p className="text-xs text-gray-500">9:00 PM</p>
          </button>
          
          <button
            onClick={quickSetFloss}
            className="group p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <Activity className="w-6 h-6 text-cyan-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-semibold text-gray-700">{translatedText.floss}</p>
            <p className="text-xs text-gray-500">8:30 PM</p>
          </button>
        </div>
      </div>

      {/* Reminder Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-md border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <p className="text-xs text-gray-500">{translatedText.onTimeActions}</p>
          </div>
          <p className="text-3xl font-black text-gray-900">{reminderStats.onTimeCount}</p>
          <p className="text-xs text-gray-500 mt-1">{translatedText.onTimeActionsDesc}</p>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-md border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <p className="text-xs text-gray-500">{translatedText.reminderStreak}</p>
          </div>
          <p className="text-3xl font-black text-gray-900">{reminderStats.streak}</p>
          <p className="text-xs text-gray-500 mt-1">{translatedText.reminderStreakDesc}</p>
        </div>
      </div>

      {/* Custom Reminders */}
      <div className="bg-white rounded-3xl p-5 shadow-lg border border-blue-100 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">{translatedText.customTimes}</h3>
        </div>

        <ReminderRow
          label={translatedText.morningBrush}
          icon={<Sun className="w-5 h-5 text-orange-500" />}
          time={reminders.morning}
          onChange={(v) => updateTime("morning", v)}
        />

        <ReminderRow
          label={translatedText.nightBrush}
          icon={<Moon className="w-5 h-5 text-indigo-500" />}
          time={reminders.night}
          onChange={(v) => updateTime("night", v)}
        />

        <ReminderRow
          label={translatedText.flossTime}
          icon={<Activity className="w-5 h-5 text-cyan-500" />}
          time={reminders.floss}
          onChange={(v) => updateTime("floss", v)}
        />
      </div>

      {/* Enable Button */}
      {!notificationsEnabled && (
        <button
          onClick={handleNotifications}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-5 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          <Bell className="w-5 h-5" />
          {translatedText.enableButton}
        </button>
      )}

      {/* Message */}
      {message && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center animate-[fadeIn_0.3s_ease-out]">
          <p className="text-sm text-gray-700 font-medium">{message}</p>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-gray-900 text-sm mb-2">{translatedText.tipsTitle}</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>{translatedText.tip1}</li>
              <li>{translatedText.tip2}</li>
              <li>{translatedText.tip3}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* iOS Notice */}
      {isIOS && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900 text-sm mb-1">{translatedText.iosTitle}</p>
              <p className="text-xs text-gray-600">
                {translatedText.iosMessage}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ReminderRow({ label, icon, time, onChange }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200">
      <div className="flex items-center gap-3">
        {icon}
        <p className="font-semibold text-gray-900">{label}</p>
      </div>

      <input
        type="time"
        value={time}
        onChange={(e) => onChange(e.target.value)}
        className="border-2 border-blue-200 rounded-xl px-4 py-2 text-sm font-semibold hover:border-blue-400 focus:border-blue-500 focus:outline-none transition-colors"
      />
    </div>
  );
}
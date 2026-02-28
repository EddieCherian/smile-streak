import { scheduleDailyNotifications } from "../utils/scheduleNotifications";
import { useState, useEffect } from "react";
import { getReminders, saveReminders } from "../utils/reminders";
import { requestNotificationPermission } from "../utils/notifications";
import { Bell, BellOff, Clock, Sparkles, Zap, CheckCircle2, TrendingUp, Moon, Sun, Activity } from "lucide-react";

const isIOS = /iPhone|iPad|iPo/.test(navigator.userAgent);

export default function Reminders() {
  const [reminders, setReminders] = useState(getReminders());
  const [message, setMessage] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderStats, setReminderStats] = useState({
    onTimeCount: 0,
    streak: 0
  });

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
      setMessage("📱 Notifications not supported on iPhone. Please use Safari's Add to Home Screen feature for reminders.");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    const permission = await requestNotificationPermission();

    if (permission === "granted") {
      scheduleDailyNotifications();
      setNotificationsEnabled(true);
      setMessage("✅ Notifications enabled successfully!");
      setTimeout(() => setMessage(""), 3000);
    } else if (permission === "denied") {
      setMessage("❌ Notifications blocked. Please enable in browser settings.");
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const quickSetMorning = () => {
    updateTime("morning", "08:00");
    setMessage("⏰ Morning reminder set to 8:00 AM");
    setTimeout(() => setMessage(""), 2000);
  };

  const quickSetNight = () => {
    updateTime("night", "21:00");
    setMessage("🌙 Night reminder set to 9:00 PM");
    setTimeout(() => setMessage(""), 2000);
  };

  const quickSetFloss = () => {
    updateTime("floss", "20:30");
    setMessage("🧵 Floss reminder set to 8:30 PM");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <section className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-6 h-6" />
            <h2 className="text-2xl font-black">Reminders</h2>
          </div>
          <p className="text-sm opacity-90">Stay on track with smart notifications</p>
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
                <p className="font-bold text-gray-900">Notifications Active</p>
                <p className="text-xs text-gray-600">You'll receive reminders at your scheduled times</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <BellOff className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">Enable Notifications</p>
                <p className="text-xs text-gray-600">Get reminded when it's time to brush and floss</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl p-5 shadow-lg border border-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">Quick Setup</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={quickSetMorning}
            className="group p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <Sun className="w-6 h-6 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-semibold text-gray-700">Morning</p>
            <p className="text-xs text-gray-500">8:00 AM</p>
          </button>
          
          <button
            onClick={quickSetNight}
            className="group p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <Moon className="w-6 h-6 text-indigo-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-semibold text-gray-700">Night</p>
            <p className="text-xs text-gray-500">9:00 PM</p>
          </button>
          
          <button
            onClick={quickSetFloss}
            className="group p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <Activity className="w-6 h-6 text-cyan-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-semibold text-gray-700">Floss</p>
            <p className="text-xs text-gray-500">8:30 PM</p>
          </button>
        </div>
      </div>

      {/* Reminder Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-md border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <p className="text-xs text-gray-500">On-Time Actions</p>
          </div>
          <p className="text-3xl font-black text-gray-900">{reminderStats.onTimeCount}</p>
          <p className="text-xs text-gray-500 mt-1">Times you acted on reminders</p>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-md border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <p className="text-xs text-gray-500">Reminder Streak</p>
          </div>
          <p className="text-3xl font-black text-gray-900">{reminderStats.streak}</p>
          <p className="text-xs text-gray-500 mt-1">Consecutive days</p>
        </div>
      </div>

      {/* Custom Reminders */}
      <div className="bg-white rounded-3xl p-5 shadow-lg border border-blue-100 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">Custom Times</h3>
        </div>

        <ReminderRow
          label="Morning Brush"
          icon={<Sun className="w-5 h-5 text-orange-500" />}
          time={reminders.morning}
          onChange={(v) => updateTime("morning", v)}
        />

        <ReminderRow
          label="Night Brush"
          icon={<Moon className="w-5 h-5 text-indigo-500" />}
          time={reminders.night}
          onChange={(v) => updateTime("night", v)}
        />

        <ReminderRow
          label="Floss Time"
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
          Enable Notifications
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
            <p className="font-bold text-gray-900 text-sm mb-2">Reminder Tips</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Set reminders 30 minutes before meals for best results</li>
              <li>• Night reminders work best 1 hour before bed</li>
              <li>• Consistent timing builds stronger habits</li>
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
              <p className="font-bold text-gray-900 text-sm mb-1">iPhone Users</p>
              <p className="text-xs text-gray-600">
                Safari doesn't support web notifications. Add SmileStreak to your home screen for the best experience!
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

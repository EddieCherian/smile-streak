import { scheduleDailyNotifications } from "../utils/scheduleNotifications";
import { useState, useEffect } from "react";
import { getReminders, saveReminders } from "../utils/reminders";
import { requestNotificationPermission } from "../utils/notifications";

export default function Reminders() {
  const [reminders, setReminders] = useState(getReminders());

  useEffect(() => {
    saveReminders(reminders);
  }, [reminders]);

  const updateTime = (key, value) => {
    setReminders((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold">Reminders</h2>

      {/* MORNING */}
      <ReminderRow
        label="Morning Brush"
        time={reminders.morning}
        onChange={(v) => updateTime("morning", v)}
      />

      {/* NIGHT */}
      <ReminderRow
        label="Night Brush"
        time={reminders.night}
        onChange={(v) => updateTime("night", v)}
      />

      {/* FLOSS */}
      <ReminderRow
        label="Floss"
        time={reminders.floss}
        onChange={(v) => updateTime("floss", v)}
      />

      <button
  onClick={async () => {
    await requestNotificationPermission();
    scheduleDailyNotifications();
  }}
  className="w-full bg-cyan-600 text-white p-4 rounded-xl font-semibold hover:bg-cyan-700 transition"
>
  Enable Notifications 🔔
</button>
    </section>
  );
}

function ReminderRow({ label, time, onChange }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow flex items-center justify-between">
      <p className="font-semibold">{label}</p>

      <input
        type="time"
        value={time}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-lg px-3 py-1 text-sm"
      />
    </div>
  );
}

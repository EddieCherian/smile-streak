import {
  Shield, FileText, Lock, AlertTriangle,
  Download, Trash2, Database, CheckCircle
} from "lucide-react";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // adjust path if needed

export default function Legal() {
  const [exported, setExported] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [sent, setSent] = useState(false);

  /* ---------------------------
     CLAUDE-STYLE EXPORT
  --------------------------- */
  const exportData = () => {
    const habits = JSON.parse(localStorage.getItem("habits") || "[]");
    const streaks = JSON.parse(localStorage.getItem("streaks") || "[]");
    const scans = JSON.parse(localStorage.getItem("scans") || "[]");

    const totalCompletions = streaks.length;
    const longestStreak = Math.max(0, ...streaks.map(s => s.length || 0));
    const avgStreak =
      streaks.length === 0
        ? 0
        : streaks.reduce((a, b) => a + (b.length || 0), 0) / streaks.length;

    const report = {
      profile: {
        exportedAt: new Date().toISOString(),
        app: "SmileStreak"
      },

      summary: {
        habitsTracked: habits.length,
        totalCheckins: totalCompletions,
        longestStreak,
        averageStreak: Math.round(avgStreak * 10) / 10,
        scansUploaded: scans.length
      },

      behavioralInsights: {
        consistencyScore:
          longestStreak > 14
            ? "High"
            : longestStreak > 5
            ? "Moderate"
            : "Developing",

        engagementLevel:
          totalCompletions > 50
            ? "Active"
            : totalCompletions > 10
            ? "Growing"
            : "New user"
      },

      timeline: {
        firstRecordedActivity: streaks[0]?.date || null,
        lastRecordedActivity: streaks[streaks.length - 1]?.date || null
      },

      rawData: {
        habits,
        streaks,
        scans
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "smilestreak-report.json";
    a.click();

    setExported(true);
    setTimeout(() => setExported(false), 4000);
  };

  /* ---------------------------
     TRUE RESET FUNCTION
  --------------------------- */
  const deleteData = async () => {
    if (!confirm("This will completely reset SmileStreak. Continue?")) return;

    // clear localStorage
    localStorage.clear();

    // clear indexedDB (offline cache)
    indexedDB.databases?.().then(dbs => {
      dbs.forEach(db => indexedDB.deleteDatabase(db.name));
    });

    // sign user out
    try {
      await signOut(auth);
    } catch {}

    setDeleted(true);

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  /* ---------------------------
     FORM SUBMIT FIX
  --------------------------- */
  const submitForm = async (e) => {
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);

    await fetch("https://formspree.io/f/mqedoavq", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" }
    });

    setSent(true);
    form.reset();
  };

  return (
    <div className="space-y-6 pb-10">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl">
        <h2 className="text-2xl font-black">Legal & Data Control</h2>
        <p className="text-sm opacity-90">
          Full transparency and control over your SmileStreak data.
        </p>
      </div>

      {/* DATA CONTROLS */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
        <h3 className="font-black text-gray-900 mb-4">Your Data Controls</h3>

        <div className="grid gap-3">

          <button
            onClick={exportData}
            className="flex items-center justify-between p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 hover:bg-blue-100"
          >
            <span className="font-semibold text-gray-900 text-sm">
              Export My Full Report
            </span>
            {exported && <CheckCircle className="text-green-500 w-4 h-4" />}
          </button>

          <button
            onClick={deleteData}
            className="flex items-center justify-between p-4 rounded-2xl bg-red-50 border-2 border-red-200 hover:bg-red-100"
          >
            <span className="font-semibold text-gray-900 text-sm">
              Reset SmileStreak Completely
            </span>
            {deleted && <CheckCircle className="text-green-500 w-4 h-4" />}
          </button>

        </div>
      </div>

      {/* SUPPORT FORM */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-3xl p-6 shadow-lg">
        <h3 className="font-black text-gray-900 mb-4">
          Contact Support
        </h3>

        {sent ? (
          <p className="text-green-600 font-semibold text-sm">
            Message sent successfully.
          </p>
        ) : (
          <form onSubmit={submitForm} className="space-y-3">
            <input
              type="email"
              name="email"
              placeholder="Your email"
              required
              className="w-full p-3 rounded-xl border border-gray-200"
            />

            <textarea
              name="message"
              placeholder="Describe your issue..."
              required
              rows={4}
              className="w-full p-3 rounded-xl border border-gray-200"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
        )}
      </div>

      <div className="text-center pt-2">
        <p className="text-xs text-gray-400">
          SmileStreak • {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
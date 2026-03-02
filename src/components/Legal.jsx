import {
  Shield, FileText, Lock, AlertTriangle,
  Download, Trash2, Database, CheckCircle
} from "lucide-react";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // adjust path if needed

export default function Legal() {
  const [open, setOpen] = useState(null);
  const [exported, setExported] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [sent, setSent] = useState(false);

  const toggle = (section) => {
    setOpen(open === section ? null : section);
  };

  /* ---------------------------
     ADVANCED EXPORT
  --------------------------- */
  const exportData = () => {
    const habits = JSON.parse(localStorage.getItem("habits") || "[]");
    const streaks = JSON.parse(localStorage.getItem("streaks") || "[]");
    const scans = JSON.parse(localStorage.getItem("scans") || "[]");

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
        longestStreak,
        averageStreak: Math.round(avgStreak * 10) / 10,
        scansUploaded: scans.length
      },
      insights: {
        consistency:
          longestStreak > 14 ? "High"
          : longestStreak > 5 ? "Moderate"
          : "Developing"
      },
      rawData: { habits, streaks, scans }
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
     TRUE RESET
  --------------------------- */
  const deleteData = async () => {
    if (!confirm("This will completely reset SmileStreak. Continue?")) return;

    localStorage.clear();

    indexedDB.databases?.().then(dbs => {
      dbs.forEach(db => indexedDB.deleteDatabase(db.name));
    });

    try { await signOut(auth); } catch {}

    setDeleted(true);
    setTimeout(() => window.location.reload(), 1500);
  };

  /* ---------------------------
     FORM FIX (REACT SAFE)
  --------------------------- */
  const submitForm = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    await fetch("https://formspree.io/f/mqedoavq", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" }
    });

    setSent(true);
    e.target.reset();
  };

  /* ---------------------------
     ORIGINAL LEGAL SECTIONS (UNCHANGED)
  --------------------------- */
  const sections = [
    {
      id: 1,
      title: "Educational Purpose",
      icon: <FileText className="w-5 h-5" />,
      content: `SmileStreak is an educational habit-building tool. Any AI feedback,
      reports, or insights are informational only and do not replace professional
      dental advice, diagnosis, or treatment.`
    },
    {
      id: 2,
      title: "User Responsibility",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: `You are responsible for your health decisions. Always consult a
      licensed dental professional for medical concerns.`
    },
    {
      id: 3,
      title: "Image & Scan Processing",
      icon: <Database className="w-5 h-5" />,
      content: `Images uploaded for scans are processed only to generate feedback.
      SmileStreak does not sell or share scan images.`
    },
    {
      id: 4,
      title: "Privacy & Data Use",
      icon: <Lock className="w-5 h-5" />,
      content: `We collect only minimal usage data needed for the app to function.
      This data improves your experience and app stability.`
    },
    {
      id: 5,
      title: "Liability Limitation",
      icon: <Shield className="w-5 h-5" />,
      content: `SmileStreak is not responsible for medical or dental outcomes.
      Use of this software is voluntary.`
    }
  ];

  return (
    <div className="space-y-6 pb-10">

      {/* HERO */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-6 h-6" />
          <h2 className="text-2xl font-black">Legal & Privacy</h2>
        </div>
        <p className="text-sm opacity-90">
          Transparency, safety, and control over your data.
        </p>
      </div>

      {/* ACCORDION TERMS */}
      <div className="bg-white rounded-3xl shadow-lg border border-blue-100 overflow-hidden">
        {sections.map((s) => (
          <div key={s.id} className="border-b last:border-none border-gray-100">
            <button
              onClick={() => toggle(s.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-blue-50"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="text-blue-600">{s.icon}</div>
                <span className="font-bold text-gray-900 text-sm">
                  {s.id}. {s.title}
                </span>
              </div>
              <span className="text-gray-400 text-xs">
                {open === s.id ? "Hide" : "View"}
              </span>
            </button>

            {open === s.id && (
              <div className="px-5 pb-5 text-sm text-gray-700">
                {s.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* DATA CONTROLS */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
        <h3 className="font-black text-gray-900 mb-4">Your Data Controls</h3>

        <div className="grid gap-3">

          <button onClick={exportData}
            className="flex items-center justify-between p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 hover:bg-blue-100">
            <span className="font-semibold text-gray-900 text-sm">
              Export My Full Report
            </span>
            {exported && <CheckCircle className="text-green-500 w-4 h-4" />}
          </button>

          <button onClick={deleteData}
            className="flex items-center justify-between p-4 rounded-2xl bg-red-50 border-2 border-red-200 hover:bg-red-100">
            <span className="font-semibold text-gray-900 text-sm">
              Reset SmileStreak Completely
            </span>
            {deleted && <CheckCircle className="text-green-500 w-4 h-4" />}
          </button>

        </div>
      </div>

      {/* SUPPORT FORM */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-3xl p-6 shadow-lg">
        <h3 className="font-black text-gray-900 mb-4">Contact Support</h3>

        {sent ? (
          <p className="text-green-600 font-semibold text-sm">
            Message sent successfully.
          </p>
        ) : (
          <form onSubmit={submitForm} className="space-y-3">
            <input type="email" name="email" placeholder="Your email" required
              className="w-full p-3 rounded-xl border border-gray-200" />

            <textarea name="message" placeholder="Describe your issue..." required rows={4}
              className="w-full p-3 rounded-xl border border-gray-200" />

            <button type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700">
              Send Message
            </button>
          </form>
        )}
      </div>

      {/* FOOTER */}
      <div className="text-center pt-2">
        <p className="text-xs text-gray-400">
          SmileStreak v1.0.0 • Last updated {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
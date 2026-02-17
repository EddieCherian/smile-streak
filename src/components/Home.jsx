import { useEffect, useState } from "react";

export default function Home({ setActiveTab }) {
  const [streak, setStreak] = useState(0);

  // safely read streak from local storage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("habitData") || "{}");
      if (stored?.streak) setStreak(stored.streak);
      else if (stored?.currentStreak) setStreak(stored.currentStreak);
    } catch {
      setStreak(0);
    }
  }, []);

  const go = (tab) => {
    if (typeof setActiveTab === "function") {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow p-5 border border-blue-100">
          <img
            src="/icon-511.png"
            alt="SmileStreak logo"
            className="w-14 h-14 rounded-xl shadow object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SmileStreak</h1>
            <p className="text-sm text-gray-600">
              Build smarter dental habits with AI feedback and real-world care tools.
            </p>
          </div>
        </div>

        {/* CURRENT STREAK CARD */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl shadow p-6 flex justify-between items-center">
          <div>
            <p className="text-sm opacity-90">Current Streak</p>
            <p className="text-3xl font-bold">{streak} days</p>
          </div>
          <button
            onClick={() => go("today")}
            className="bg-white text-blue-700 text-sm font-semibold px-4 py-2 rounded-xl shadow hover:bg-blue-50 transition"
          >
            Update Today
          </button>
        </div>

        {/* FEATURE SUMMARY */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl shadow p-6 space-y-3">
          <h2 className="font-semibold text-blue-700">Your Dental Companion</h2>

          <ul className="text-sm text-gray-700 space-y-1">
            <li>• AI-powered scan feedback on brushing quality</li>
            <li>• Daily streak tracking to build consistency</li>
            <li>• Dentist finder with insurance info</li>
            <li>• Progress insights to measure improvement</li>
          </ul>
        </div>

        {/* NAV GRID */}
        <div className="grid grid-cols-2 gap-4">

          <button
            onClick={() => go("scan")}
            className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-5 shadow hover:shadow-md hover:from-blue-100 hover:to-cyan-100 transition text-left"
          >
            <p className="font-semibold text-blue-700">Scan Teeth</p>
            <p className="text-xs text-gray-500">AI brushing feedback</p>
          </button>

          <button
            onClick={() => go("today")}
            className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-5 shadow hover:shadow-md hover:from-blue-100 hover:to-cyan-100 transition text-left"
          >
            <p className="font-semibold text-blue-700">Streaks</p>
            <p className="text-xs text-gray-500">Track daily habits</p>
          </button>

          <button
            onClick={() => go("dentists")}
            className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-5 shadow hover:shadow-md hover:from-blue-100 hover:to-cyan-100 transition text-left"
          >
            <p className="font-semibold text-blue-700">Find Dentists</p>
            <p className="text-xs text-gray-500">Nearby care + insurance</p>
          </button>

          <button
            onClick={() => go("progress")}
            className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-5 shadow hover:shadow-md hover:from-blue-100 hover:to-cyan-100 transition text-left"
          >
            <p className="font-semibold text-blue-700">Progress</p>
            <p className="text-xs text-gray-500">Review improvements</p>
          </button>

        </div>

      </div>
    </div>
  );
}
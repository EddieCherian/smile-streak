export default function Home({ setActiveTab }) {

  const go = (tab) => {
    if (typeof setActiveTab === "function") {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* HEADER WITH LOGO */}
        <div className="flex items-center gap-4">
          <img
            src="/icon-511.png"
            alt="SmileStreak logo"
            className="w-16 h-16 rounded-xl shadow-md object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold">SmileStreak</h1>
            <p className="text-gray-600">
              Improve dental habits with AI feedback, streak tracking, and real-world care guidance.
            </p>
          </div>
        </div>

        {/* FEATURES */}
        <div className="bg-white border rounded-xl p-6 shadow space-y-4">
          <h2 className="font-semibold text-lg">What this app does</h2>

          <ul className="text-sm text-gray-700 space-y-2">
            <li><strong>AI Dental Scan:</strong> Upload a photo of your teeth for hygiene feedback.</li>
            <li><strong>Daily Streak Tracking:</strong> Build consistent brushing habits.</li>
            <li><strong>Nearby Dentists:</strong> Find dentists and see accepted insurance.</li>
            <li><strong>Progress Tracking:</strong> Monitor improvement over time.</li>
          </ul>
        </div>

        {/* NAV BUTTONS */}
        <div className="grid grid-cols-2 gap-4">

          <button onClick={() => go("scan")} className="bg-white border rounded-xl p-5 shadow hover:bg-gray-50 text-left">
            <p className="font-semibold">Scan Teeth</p>
            <p className="text-xs text-gray-500">Get AI hygiene feedback</p>
          </button>

          <button onClick={() => go("today")} className="bg-white border rounded-xl p-5 shadow hover:bg-gray-50 text-left">
            <p className="font-semibold">Streaks</p>
            <p className="text-xs text-gray-500">Track brushing consistency</p>
          </button>

          <button onClick={() => go("dentists")} className="bg-white border rounded-xl p-5 shadow hover:bg-gray-50 text-left">
            <p className="font-semibold">Find Dentists</p>
            <p className="text-xs text-gray-500">See nearby dentists & insurance</p>
          </button>

          <button onClick={() => go("progress")} className="bg-white border rounded-xl p-5 shadow hover:bg-gray-50 text-left">
            <p className="font-semibold">Progress</p>
            <p className="text-xs text-gray-500">Review past feedback</p>
          </button>

        </div>

      </div>
    </div>
  );
}
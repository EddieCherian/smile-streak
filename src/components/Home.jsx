export default function Home({ setActiveTab }) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">SmileStreak</h1>
          <p className="text-gray-600">
            Improve dental habits with AI feedback, streak tracking, and real-world care guidance.
          </p>
        </div>

        {/* Features overview */}
        <div className="bg-white border rounded-xl p-6 shadow space-y-4">
          <h2 className="font-semibold text-lg">What this app does</h2>

          <ul className="text-sm text-gray-700 space-y-2">
            <li>
              <strong>AI Dental Scan:</strong> Upload a photo of your teeth to get feedback on brushing quality, plaque visibility, and gum care.
            </li>

            <li>
              <strong>Daily Streak Tracking:</strong> Stay consistent with brushing and build long-term hygiene habits.
            </li>

            <li>
              <strong>Nearby Dentists:</strong> Find dentists near you and see what insurance they accept so you can get professional care easily.
            </li>

            <li>
              <strong>Progress Tracking:</strong> Monitor improvement over time and review past feedback.
            </li>
          </ul>
        </div>

        {/* Navigation cards */}
        <div className="grid grid-cols-2 gap-4">

          <button
            onClick={() => setActiveTab("scan")}
            className="bg-white border rounded-xl p-5 shadow hover:bg-gray-50 text-left"
          >
            <p className="font-semibold">Scan Teeth</p>
            <p className="text-xs text-gray-500">Get AI hygiene feedback</p>
          </button>

          <button
            onClick={() => setActiveTab("today")}
            className="bg-white border rounded-xl p-5 shadow hover:bg-gray-50 text-left"
          >
            <p className="font-semibold">Streaks</p>
            <p className="text-xs text-gray-500">Track daily brushing consistency</p>
          </button>

          <button
            onClick={() => setActiveTab("dentists")}
            className="bg-white border rounded-xl p-5 shadow hover:bg-gray-50 text-left"
          >
            <p className="font-semibold">Find Dentists</p>
            <p className="text-xs text-gray-500">See nearby dentists & accepted insurance</p>
          </button>

          <button
            onClick={() => setActiveTab("progress")}
            className="bg-white border rounded-xl p-5 shadow hover:bg-gray-50 text-left"
          >
            <p className="font-semibold">Progress</p>
            <p className="text-xs text-gray-500">Review past feedback</p>
          </button>

        </div>

      </div>
    </div>
  );
}
export default function Mission() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-md">
        <h2 className="text-lg font-bold mb-3">Our Mission</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Smile Streak was built to help people develop consistent oral health
          habits without guilt, pressure, or misinformation.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-md">
        <h3 className="font-bold mb-2">Why This App Exists</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Many dental health apps focus on streaks and reminders but ignore
          why habits fail. This app emphasizes reflection, patterns, and
          progress over perfection.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-md">
        <h3 className="font-bold mb-2">Our Design Principles</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>• Education over diagnosis</li>
          <li>• Trends over daily pressure</li>
          <li>• Privacy-first, local-only data</li>
          <li>• Insights shown only when meaningful</li>
        </ul>
      </div>

      <div className="bg-cyan-50 p-6 rounded-3xl border border-cyan-200">
        <p className="text-sm text-cyan-900">
          This app does not replace professional dental care. It is designed to
          support healthier routines through awareness and consistency.
        </p>
      </div>
    </div>
  );
}

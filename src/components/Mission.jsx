export default function Mission() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-md">
        <h2 className="text-lg font-bold mb-3">Our Mission</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Smile Streak was built to help people develop consistent oral health
          habits without guilt, pressure, or misinformation.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed mt-3">
          Rather than focusing on perfection or streak anxiety, the goal is to
          encourage sustainable routines that align with real human behavior
          and evidence-based dental guidance.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-md">
        <h3 className="font-bold mb-2">Why This App Exists</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Many dental health apps focus heavily on reminders and streaks, but
          fail to address why habits break down in the first place. Missed days
          are often caused by stress, schedule changes, fatigue, or lack of
          awareness — not lack of motivation.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed mt-3">
          Smile Streak was created to emphasize reflection, pattern recognition,
          and long-term progress over short-term perfection. By helping users
          understand their habits, the app aims to make healthy routines easier
          to maintain over time.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-md">
        <h3 className="font-bold mb-2">Research-Informed Design</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          The structure of this app is informed by published dental research and
          public health guidance from organizations such as the American Dental
          Association and the Centers for Disease Control and Prevention.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed mt-3">
          Habit tracking, reflection prompts, and delayed insights are designed
          to prioritize consistency, reduce cognitive overload, and avoid
          drawing conclusions from insufficient data.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-md">
        <h3 className="font-bold mb-2">Our Design Principles</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>• Education over diagnosis</li>
          <li>• Trends over daily pressure</li>
          <li>• Reflection over punishment</li>
          <li>• Privacy-first, local-only data storage</li>
          <li>• Insights shown only when data is meaningful</li>
          <li>• Transparency about limitations and uncertainty</li>
        </ul>
      </div>

      <div className="bg-cyan-50 p-6 rounded-3xl border border-cyan-200">
        <p className="text-sm text-cyan-900 leading-relaxed">
          <strong>Important:</strong> Smile Streak is designed for education and
          habit awareness only. It does not provide medical diagnosis or
          treatment recommendations. Users should always consult a licensed
          dental professional for personalized advice or concerns about their
          oral health.
        </p>
      </div>
    </div>
  );
}

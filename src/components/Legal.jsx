export default function Legal() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white border rounded-xl p-8 shadow space-y-6">

        <h1 className="text-2xl font-bold">SmileStreak Legal & Privacy</h1>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">1. Educational Purpose</h2>
          <p className="text-sm text-gray-700">
            SmileStreak is an educational tool designed to promote better dental habits.
            The AI feedback, streak tracking, and reports are informational only and do
            not replace professional dental advice, diagnosis, or treatment.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">2. User Responsibility</h2>
          <p className="text-sm text-gray-700">
            By using this app, you understand that any health-related insights are
            suggestions only. Always consult a licensed dental professional for
            medical concerns or treatment decisions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">3. Image & Data Usage</h2>
          <p className="text-sm text-gray-700">
            Images uploaded for scanning are processed only to generate feedback.
            SmileStreak does not sell user data. Stored progress information is kept
            locally on your device unless otherwise stated.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">4. Privacy</h2>
          <p className="text-sm text-gray-700">
            We collect minimal data necessary to operate the app, such as usage
            analytics, streak data, and optional scan uploads. This data is used only
            to improve the user experience and functionality of the app.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">5. Liability Limitation</h2>
          <p className="text-sm text-gray-700">
            SmileStreak and its creators are not responsible for any medical,
            dental, or personal outcomes resulting from use of the app. Use of
            this tool is at your own discretion.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">6. Updates</h2>
          <p className="text-sm text-gray-700">
            These terms may be updated as the app evolves. Continued use of the
            app indicates acceptance of the current version.
          </p>
        </section>

        <p className="text-xs text-gray-400 pt-4">
          Last updated: {new Date().getFullYear()}
        </p>

      </div>
    </div>
  );
}

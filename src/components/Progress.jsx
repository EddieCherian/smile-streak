import { ACHIEVEMENTS } from "../data";
import { calculateStreaks } from "../utils/progress";

export default function Progress({ habitData }) {
  const days = Object.values(habitData);
  const completed = days.filter(
    (d) => d?.morning && d?.night && d?.floss
  ).length;

  const { currentStreak, longestStreak } =
    calculateStreaks(habitData);

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Completed" value={completed} />
        <Stat label="Current" value={currentStreak} />
        <Stat label="Longest" value={longestStreak} />
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-md">
        <h3 className="font-bold mb-4">Achievements</h3>
        <div className="grid grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((a) => (
            <div
              key={a.id}
              className={`p-4 rounded-2xl text-center ${
                completed >= a.requirement
                  ? "bg-yellow-100"
                  : "bg-gray-100 opacity-50"
              }`}
            >
              <div className="text-3xl">{a.icon}</div>
              <p className="text-xs font-semibold mt-1">
                {a.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-extrabold text-cyan-600">
        {value}
      </p>
    </div>
  );
}

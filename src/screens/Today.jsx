import { useMemo } from "react";
import TaskRow from "../components/TaskRow";
import { getTodayKey } from "../lib/dates";

export default function Today({ habitData, setHabitData }) {
  const todayKey = getTodayKey();

  const today = habitData[todayKey] || {
    morning: false,
    night: false,
    floss: false,
  };

  const toggle = (key) => {
    setHabitData((prev) => ({
      ...prev,
      [todayKey]: {
        ...today,
        [key]: !today[key],
      },
    }));
  };

  const completionPercent = useMemo(() => {
    const completed = Object.values(today).filter(Boolean).length;
    return Math.round((completed / 3) * 100);
  }, [today]);

  return (
    <div className="space-y-6">
      {/* Tasks */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-800">
          Today’s Routine
        </h2>

        <TaskRow
          title="Morning Brush"
          description="Brush your teeth in the morning"
          completed={today.morning}
          onToggle={() => toggle("morning")}
        />

        <TaskRow
          title="Night Brush"
          description="Brush your teeth before bed"
          completed={today.night}
          onToggle={() => toggle("night")}
        />

        <TaskRow
          title="Floss"
          description="Floss all teeth"
          completed={today.floss}
          onToggle={() => toggle("floss")}
        />
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <span>Daily Progress</span>
          <span className="font-semibold">{completionPercent}%</span>
        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

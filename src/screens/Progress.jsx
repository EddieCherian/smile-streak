import {
  getWeekData,
  getMonthlyData,
  getAchievements,
} from "../lib/progress";
import { CheckCircle } from "lucide-react";

export default function Progress({ habitData }) {
  const week = getWeekData(habitData);
  const month = getMonthlyData(habitData);
  const achievements = getAchievements(habitData);

  return (
    <div className="space-y-6">
      {/* WEEK */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-lg mb-4">This Week</h2>

        <div className="flex justify-between gap-2">
          {week.map((day, i) => (
            <div key={i} className="flex-1 text-center">
              <div
                className={`aspect-square rounded-xl flex items-center justify-center mb-2
                  ${day.completed ? "bg-green-500" : "bg-gray-200"}`}
              >
                {day.completed && (
                  <CheckCircle className="w-6 h-6 text-white" />
                )}
              </div>
              <p className="text-xs text-gray-600">{day.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MONTH */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-lg mb-4">Last 4 Weeks</h2>

        <div className="space-y-3">
          {month.map((week, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span>{week.label}</span>
                <span className="font-semibold text-cyan-600">
                  {week.percent}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  style={{ width: `${week.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACHIEVEMENTS */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-lg mb-4">Achievements</h2>

        <div className="grid grid-cols-2 gap-4">
          {achievements.map((a, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl text-center
                ${a.unlocked
                  ? "bg-gradient-to-br from-yellow-100 to-orange-100"
                  : "bg-gray-100"}`}
            >
              <div
                className={`text-3xl mb-2
                  ${!a.unlocked && "grayscale opacity-40"}`}
              >
                {a.icon}
              </div>
              <p
                className={`text-sm font-medium
                  ${a.unlocked ? "text-gray-800" : "text-gray-500"}`}
              >
                {a.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

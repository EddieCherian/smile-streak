// src/components/Insights.jsx

import { generateInsights } from "../utils/insights";

export default function Insights({ habitData }) {
  const insights = generateInsights(habitData);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white p-6 rounded-3xl shadow-md">
        <h2 className="font-bold text-lg mb-3">Your Consistency</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500">Days Tracked</p>
            <p className="text-xl font-bold">{insights.totalDays}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Days Completed</p>
            <p className="text-xl font-bold">{insights.completedDays}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Completion Rate</p>
            <p className="text-xl font-bold">{insights.completionRate}%</p>
          </div>
        </div>
      </div>

      {/* Patterns */}
      {(insights.mostMissedTask || insights.mostMissedDay) && (
        <div className="bg-white p-6 rounded-3xl shadow-md">
          <h2 className="font-bold text-lg mb-3">Patterns</h2>
          <ul className="text-sm text-gray-700 space-y-2">
            {insights.mostMissedTask && (
              <li>
                • Most commonly missed task:{" "}
                <strong className="capitalize">
                  {insights.mostMissedTask}
                </strong>
              </li>
            )}
            {insights.mostMissedDay && (
              <li>
                • Misses happen most often on{" "}
                <strong>{insights.mostMissedDay}s</strong>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Reflection Intelligence */}
      {insights.commonReflectionReason && (
        <div className="bg-white p-6 rounded-3xl shadow-md">
          <h2 className="font-bold text-lg mb-3">Reflection Insight</h2>
          <p className="text-sm text-gray-700">
            A common reason you’ve mentioned for missed days is{" "}
            <strong>“{insights.commonReflectionReason}.”</strong>
          </p>
        </div>
      )}

      {/* Gentle Nudge */}
      <div className="bg-cyan-50 p-6 rounded-3xl border border-cyan-200">
        <p className="text-sm text-cyan-900">
          Small, consistent routines matter more than perfection. Use what you’ve
          learned here to make tomorrow easier.
        </p>
      </div>
    </div>
  );
}

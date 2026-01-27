
// src/utils/insights.js

const TASKS = ["morning", "night", "floss"];
const REFLECTION_KEYWORDS = [
  "tired",
  "late",
  "forgot",
  "stress",
  "busy",
  "school",
  "exam",
  "travel"
];

export function generateInsights(habitData) {
  const dates = Object.keys(habitData).filter(
    (k) => k.match(/^\d{4}-\d{2}-\d{2}$/)
  );

  let totalDays = dates.length;
  let completedDays = 0;

  const missedTaskCount = {
    morning: 0,
    night: 0,
    floss: 0
  };

  const weekdayMisses = {};
  const reflectionCounts = {};

  dates.forEach((dateKey) => {
    const day = habitData[dateKey];
    if (!day) return;

    const completedTasks = TASKS.filter((t) => day[t]).length;
    if (completedTasks === TASKS.length) {
      completedDays++;
    } else {
      // track missed tasks
      TASKS.forEach((t) => {
        if (day[t] === false) missedTaskCount[t]++;
      });

      // track weekday misses
      const weekday = new Date(dateKey).toLocaleDateString("en-US", {
        weekday: "long"
      });
      weekdayMisses[weekday] = (weekdayMisses[weekday] || 0) + 1;
    }

    // reflection keyword analysis
    if (typeof day.reflection === "string") {
      const text = day.reflection.toLowerCase();
      REFLECTION_KEYWORDS.forEach((word) => {
        if (text.includes(word)) {
          reflectionCounts[word] = (reflectionCounts[word] || 0) + 1;
        }
      });
    }
  });

  const completionRate =
    totalDays === 0 ? 0 : Math.round((completedDays / totalDays) * 100);

  const mostMissedTask = Object.entries(missedTaskCount).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  const mostMissedDay = Object.entries(weekdayMisses).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  const commonReflectionReason = Object.entries(reflectionCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  return {
    totalDays,
    completedDays,
    completionRate,
    mostMissedTask,
    mostMissedDay,
    commonReflectionReason
  };
}

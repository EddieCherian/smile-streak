import { getDateKey, getLocalMidnight } from "./date.js";

export const calculateStreaks = (days) => {
  const today = getDateKey();
  let current = 0;
  let longest = 0;
  let temp = 0;
  let allowTodayIncomplete = true;

  const cursor = getLocalMidnight();

  for (let i = 0; i < 365; i++) {
    const dateKey = getDateKey(cursor);
    const day = days[dateKey];
    const complete =
      day?.morning === true &&
      day?.night === true &&
      day?.floss === true;

    if (complete) {
      temp++;
      longest = Math.max(longest, temp);
      if (allowTodayIncomplete) current = temp;
    } else {
      if (dateKey !== today) {
        allowTodayIncomplete = false;
        temp = 0;
      }
    }

    cursor.setDate(cursor.getDate() - 1);
  }

  return { current, longest };
};

// Export getCurrentStreak for Home component
export const getCurrentStreak = (habitData) => {
  const data = habitData || JSON.parse(localStorage.getItem("habitData") || "{}");
  const habits = data.habits || data;
  
  const streaks = calculateStreaks(habits);
  return streaks.current;
};

import storage from "./storage";
import { getDateString } from "./dates";

const KEY = "smile-streak-data";

export const loadHabits = () =>
  storage.get(KEY, {});

export const saveHabits = (data) =>
  storage.set(KEY, data);

export const getToday = (data) => {
  const today = getDateString();
  return (
    data[today] || {
      morning: false,
      night: false,
      floss: false,
      completed: false
    }
  );
};

export const toggleTask = (data, task) => {
  const today = getDateString();
  const day = getToday(data);

  const updatedDay = {
    ...day,
    [task]: !day[task]
  };

  updatedDay.completed =
    updatedDay.morning &&
    updatedDay.night &&
    updatedDay.floss;

  return {
    ...data,
    [today]: updatedDay
  };
};

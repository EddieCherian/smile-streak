import { useEffect, useMemo, useState } from "react";
import { TIPS, ACHIEVEMENTS } from "./data";
import "./App.css";

const todayKey = () => new Date().toISOString().slice(0, 10);

export default function App() {
  const [tab, setTab] = useState("today");
  const [data, setData] = useState(() =>
    JSON.parse(localStorage.getItem("smileData") || "{}")
  );

  useEffect(() => {
    localStorage.setItem("smileData", JSON.stringify(data));
  }, [data]);

  const today = todayKey();
  const todayData = data[today] || {
    morning: false,
    night: false,
    floss: false
  };

  const toggle = key =>
    setData(d => ({
      ...d,
      [today]: { ...todayData, [key]: !todayData[key] }
    }));

  const completedDays = useMemo(() => {
    return Object.values(data).filter(
      d => d.morning && d.night && d.floss
    ).length;
  }, [data]);

  const streak = useMemo(() => {
    let s = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      if (data[k]?.morning && data[k]?.night && data[k]?.floss) s++;
      else break;
    }
    return s;
  }, [data]);

  return (
    <div className="app">
      <header>
        <h1>Smile Streak</h1>
        <span>🔥 {streak}</span>
      </header>

      <nav>
        {["today", "progress", "tips"].map(t => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>

      <main>
        {tab === "today" && (
          <div className="card">
            <h2>Today</h2>

            {["morning", "night", "floss"].map(k => (
              <label key={k} className="task">
                <input
                  type="checkbox"
                  checked={todayData[k]}
                  onChange={() => toggle(k)}
                />
                {k === "morning" && "Morning Brush"}
                {k === "night" && "Night Brush"}
                {k === "floss" && "Floss"}
              </label>
            ))}

            <div className="progress">
              {Math.round(
                (Object.values(todayData).filter(Boolean).length / 3) * 100
              )}
              % complete
            </div>
          </div>
        )}

        {tab === "progress" && (
          <>
            <div className="card">
              <h2>Stats</h2>
              <p>Completed Days: {completedDays}</p>
              <p>Current Streak: {streak}</p>
            </div>

            <div className="card">
              <h2>Achievements</h2>
              {ACHIEVEMENTS.map(a => (
                <div
                  key={a.days}
                  className={
                    streak >= a.days ? "achievement unlocked" : "achievement"
                  }
                >
                  {a.label}
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "tips" && (
          <div className="card">
            <h2>Dental Tips</h2>
            {TIPS.map(t => (
              <div key={t.title} className="tip">
                <strong>{t.title}</strong>
                <p>{t.text}</p>
                <span>{t.source}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

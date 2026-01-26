import React from "react";

export default function Today() {
  return (
    <>
      <h2 className="section-title">Today's Routine</h2>

      <div className="card routine-card">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="circle" />
          <div>
            <strong>Complete Daily Routine</strong>
            <p className="muted">
              Morning brush + Night brush + Floss
            </p>
          </div>
        </div>

        <div className="progress-row">
          <span>Daily Progress</span>
          <span>0%</span>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "0%" }} />
        </div>
      </div>

      <div className="grid-2">
        <div className="card center">
          🔥
          <h3>0</h3>
          <p className="muted">Current Streak</p>
        </div>

        <div className="card center">
          🏅
          <h3>0</h3>
          <p className="muted">Best Streak</p>
        </div>
      </div>
    </>
  );
}

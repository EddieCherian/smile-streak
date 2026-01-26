import React from "react";

export default function Progress() {
  return (
    <>
      <h2 className="section-title">This Week</h2>

      <div className="week-row">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day => (
          <div key={day} className="day-circle">
            <span>{day}</span>
          </div>
        ))}
      </div>

      <h2 className="section-title">Last 4 Weeks</h2>

      {[1,2,3,4].map(week => (
        <div key={week} className="week-progress">
          <div className="progress-row">
            <span>Week {week}</span>
            <span>0%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "0%" }} />
          </div>
        </div>
      ))}

      <h2 className="section-title">Achievements</h2>

      <div className="grid-3">
        {[
          "7 Days","14 Days","30 Days",
          "Perfect Week","Started","Consistent"
        ].map(a => (
          <div key={a} className="card center muted-card">
            <strong>{a}</strong>
          </div>
        ))}
      </div>
    </>
  );
}

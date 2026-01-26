export default function Reminders() {
  return (
    <>
      <div className="alert-box">
        <p>
          Enable demo notifications to see how reminders would work.
          These are instant demos, not scheduled.
        </p>
        <button className="yellow-btn">
          Enable Demo Notifications
        </button>
      </div>

      <h2 className="section-title">Reminders</h2>

      {[
        ["Morning Routine","08:00"],
        ["Night Routine","21:00"]
      ].map(([title,time]) => (
        <div key={title} className="card reminder-row">
          <div>
            <strong>{title}</strong>
            <p className="muted">{time}</p>
          </div>
          <div className="toggle on" />
        </div>
      ))}

      <div className="tip-box">
        💡 <strong>Habit Tip:</strong> Consistent timing helps build habits.
        Try completing routines at the same time daily.
      </div>
    </>
  );
}

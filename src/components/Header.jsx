import React from "react";

export default function Header() {
  return (
    <>
      <div className="header-card">
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700" }}>
            Smile Streak
          </h1>
          <p style={{ opacity: 0.9, marginTop: "4px" }}>
            Complete your routine today! 💪
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.2)",
            borderRadius: "999px",
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: "600",
          }}
        >
          🔥 0
        </div>
      </div>

      <div className="card" style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          👥 <span>1 user</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          🏅 <span>0 completions</span>
        </div>
      </div>
    </>
  );
}

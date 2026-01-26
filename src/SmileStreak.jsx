import React, { useState, useEffect, useMemo } from "react";
import {
CheckCircle,
Circle,
Flame,
Calendar,
Award,
TrendingUp,
Book,
} from "lucide-react";

/* ---------- Utilities ---------- */

const todayKey = () => new Date().toISOString().slice(0, 10);

const load = (k, d) => {
try {
return JSON.parse(localStorage.getItem(k)) ?? d;
} catch {
return d;
}
};

const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

/* ---------- Styles ---------- */

const styles = {
page: {
minHeight: "100vh",
background:
"linear-gradient(135deg, #ecfeff 0%, #ffffff 50%, #e0f2fe 100%)",
fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
},
header: {
background: "linear-gradient(to right, #06b6d4, #2563eb)",
color: "white",
padding: "24px",
borderBottomLeftRadius: "24px",
borderBottomRightRadius: "24px",
boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
},
streakBadge: {
display: "flex",
alignItems: "center",
gap: "8px",
background: "rgba(255,255,255,0.25)",
padding: "8px 14px",
borderRadius: "999px",
fontWeight: "700",
},
card: {
background: "white",
borderRadius: "20px",
padding: "20px",
boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
marginBottom: "16px",
},
buttonActive: {
background: "#06b6d4",
color: "white",
},
buttonInactive: {
background: "white",
color: "#374151",
},
};

/* ---------- App ---------- */

export default function SmileStreak() {
const [tab, setTab] = useState("today");
const [data, setData] = useState(() => load("habit", {}));

useEffect(() => save("habit", data), [data]);

const done = data[todayKey()]?.done ?? false;

const streak = useMemo(() => {
let count = 0;
for (let i = 0; i < 365; i++) {
const d = new Date();
d.setDate(d.getDate() - i);
const key = d.toISOString().slice(0, 10);
if (data[key]?.done) count++;
else break;
}
return count;
}, [data]);

return (
<div style={styles.page}>
{/* Header */}
<div style={styles.header}>
<div style={{ display: "flex", justifyContent: "space-between" }}>
<h1 style={{ fontSize: 28, fontWeight: 800 }}>Smile Streak</h1>
<div style={styles.streakBadge}>
<Flame color="#fdba74" />
<span>{streak}</span>
</div>
</div>
<p style={{ opacity: 0.9 }}>
{done ? "Perfect day 🎉" : "Complete your routine today 💪"}
</p>
</div>

{/* Tabs */}
<div style={{ padding: 16, display: "flex", gap: 10 }}>
{["today", "progress", "tips"].map((t) => (
<button
key={t}
onClick={() => setTab(t)}
style={{
flex: 1,
padding: "10px 14px",
borderRadius: 999,
fontWeight: 600,
border: "none",
cursor: "pointer",
...(tab === t ? styles.buttonActive : styles.buttonInactive),
}}
>
{t.toUpperCase()}
</button>
))}
</div>

<div style={{ padding: 16 }}>
{/* TODAY */}
{tab === "today" && (
<div style={styles.card}>
<h2 style={{ fontSize: 18, fontWeight: 700 }}>
Daily Dental Routine
</h2>
<p style={{ color: "#6b7280", marginBottom: 12 }}>
Brush morning & night + floss
</p>
<button
onClick={() =>
setData((p) => ({
...p,
[todayKey()]: { done: !done },
}))
}
style={{
display: "flex",
alignItems: "center",
gap: 12,
background: "#ecfeff",
borderRadius: 14,
padding: 16,
border: "2px solid #cffafe",
cursor: "pointer",
width: "100%",
}}
>
{done ? (
<CheckCircle color="#22c55e" size={32} />
) : (
<Circle color="#9ca3af" size={32} />
)}
<strong>{done ? "Completed" : "Mark as done"}</strong>
</button>
</div>
)}

{/* PROGRESS */}
{tab === "progress" && (
<div style={styles.card}>
<h2 style={{ fontWeight: 700, marginBottom: 12 }}>
Progress Overview
</h2>
<div style={{ display: "flex", gap: 16 }}>
<div style={{ flex: 1, textAlign: "center" }}>
<Flame color="#f97316" />
<p style={{ fontSize: 24, fontWeight: 800 }}>{streak}</p>
<p>Current Streak</p>
</div>
<div style={{ flex: 1, textAlign: "center" }}>
<Award color="#eab308" />
<p style={{ fontSize: 24, fontWeight: 800 }}>{streak}</p>
<p>Best Streak</p>
</div>
</div>
</div>
)}

{/* TIPS */}
{tab === "tips" && (
<div style={styles.card}>
<h2 style={{ fontWeight: 700, marginBottom: 12 }}>
Dental Tip
</h2>
<p style={{ color: "#374151" }}>
Don’t rinse after brushing — spit only. This keeps fluoride active
longer and improves enamel protection.
</p>
<div style={{ marginTop: 12, fontSize: 13, color: "#2563eb" }}>
Source: American Dental Association
</div>
</div>
)}
</div>
</div>
);
}

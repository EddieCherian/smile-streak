function Today({ habitData, setHabitData }) {
  const today = todayKey();

  const todayData = habitData[today] || {
    morning: false,
    night: false,
    floss: false
  };

  const toggle = (key) => {
    setHabitData(prev => ({
      ...prev,
      [today]: {
        ...todayData,
        [key]: !todayData[key]
      }
    }));
  };

  /* ---------------- TIMER LOGIC ---------------- */

  const BRUSH_TIME = 120; // 2 minutes

  const [timer, setTimer] = useState(null); // "morning" | "night" | null
  const [timeLeft, setTimeLeft] = useState(BRUSH_TIME);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!timer) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          toggle(timer);          // auto-complete brushing
          setTimer(null);
          return BRUSH_TIME;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ---------------- PROGRESS ---------------- */

  const completedCount = Object.values(todayData).filter(Boolean).length;
  const percent = Math.round((completedCount / 3) * 100);

  return (
    <div className="bg-white rounded-2xl p-6 shadow space-y-4">
      <h2 className="text-xl font-bold">Today's Routine</h2>

      {/* Morning & Night Brushing */}
      {["morning", "night"].map(task => (
        <button
          key={task}
          onClick={() => {
            if (todayData[task]) return;
            setTimer(task);
            setTimeLeft(BRUSH_TIME);
          }}
          className={`w-full flex justify-between items-center p-4 rounded-xl border ${
            todayData[task]
              ? "bg-green-50 border-green-400"
              : "bg-gray-50"
          }`}
        >
          <span className="capitalize">{task} brushing</span>

          <div className="flex items-center gap-3">
            {timer === task && (
              <span className="font-mono text-sm text-cyan-600">
                {formatTime(timeLeft)}
              </span>
            )}
            <span>{todayData[task] ? "✅" : "🪥"}</span>
          </div>
        </button>
      ))}

      {/* Floss */}
      <button
        onClick={() => toggle("floss")}
        className={`w-full flex justify-between items-center p-4 rounded-xl border ${
          todayData.floss
            ? "bg-green-50 border-green-400"
            : "bg-gray-50"
        }`}
      >
        <span>Floss</span>
        <span>{todayData.floss ? "✅" : "🧵"}</span>
      </button>

      {/* Progress Bar */}
      <div>
        <p className="text-sm mb-1">Daily Progress</p>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-3 bg-gradient-to-r from-cyan-500 to-blue-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

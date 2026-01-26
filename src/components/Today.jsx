const BRUSH_TIME = 120; // 2 minutes in seconds

const [timer, setTimer] = useState(null); // "morning" | "night" | null
const [timeLeft, setTimeLeft] = useState(BRUSH_TIME);
useEffect(() => {
  if (!timer) return;

  const interval = setInterval(() => {
    setTimeLeft((t) => {
      if (t <= 1) {
        clearInterval(interval);

        // Mark brushing as complete when timer finishes
        toggle(timer);
        setTimer(null);
        return BRUSH_TIME;
      }
      return t - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [timer]);
habitData
setHabitData
todayKey

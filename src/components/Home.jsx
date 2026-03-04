import { useEffect, useState, useContext } from "react";
import { 
  Scan, Calendar, MapPin, TrendingUp, Sparkles, Flame, 
  Award, Bell, Clock, Target, Star, Heart, Shield, 
  Activity, Smile, Coffee, Moon, Zap, AlertCircle,
  ChevronRight, Droplets, Brush, Pill, Apple, Camera
} from "lucide-react";
import { getCurrentStreak, getLongestStreak, getTodayProgress, getWeeklyActivity } from "../utils/streak";
import { TranslationContext, ThemeContext } from "../App";
import { storage } from "../utils/storage";

export default function Home({ setActiveTab, user, habitData }) {
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { t, currentLanguage } = useContext(TranslationContext);
  const { darkMode } = useContext(ThemeContext);
  const [texts, setTexts] = useState({});
  const [todayProgress, setTodayProgress] = useState(0);
  const [nextMilestone, setNextMilestone] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentScans, setRecentScans] = useState([]);
  const [dailyTip, setDailyTip] = useState(null);
  const [lastScanDate, setLastScanDate] = useState(null);
  const [totalScans, setTotalScans] = useState(0);
  const [weeklyActivity, setWeeklyActivity] = useState([]);

  // Daily tips database (rotating, educational content)
  const dailyTips = [
    { 
      id: 1,
      title: "Perfect Brushing Time",
      tip: "Brush for a full 2 minutes, spending 30 seconds in each quadrant of your mouth.",
      icon: <Clock className="w-4 h-4" />,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-500"
    },
    { 
      id: 2,
      title: "Flossing Facts",
      tip: "Flossing removes plaque between teeth where your toothbrush can't reach. Do it before brushing!",
      icon: <Activity className="w-4 h-4" />,
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
      borderColor: "border-cyan-200 dark:border-cyan-800",
      textColor: "text-cyan-600 dark:text-cyan-400",
      iconBg: "bg-cyan-500"
    },
    { 
      id: 3,
      title: "Mouthwash Matters",
      tip: "Use mouthwash after brushing and flossing to rinse away loosened debris and freshen breath.",
      icon: <Droplets className="w-4 h-4" />,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      textColor: "text-green-600 dark:text-green-400",
      iconBg: "bg-green-500"
    },
    { 
      id: 4,
      title: "Replace Your Toothbrush",
      tip: "Change your toothbrush every 3-4 months or sooner if bristles are frayed.",
      icon: <Brush className="w-4 h-4" />,
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      textColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-500"
    },
    { 
      id: 5,
      title: "Healthy Diet, Healthy Teeth",
      tip: "Limit sugary snacks and drinks. Crunchy fruits and veggies like apples and carrots help clean teeth naturally.",
      icon: <Apple className="w-4 h-4" />,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      textColor: "text-red-600 dark:text-red-400",
      iconBg: "bg-red-500"
    },
    { 
      id: 6,
      title: "Don't Brush Too Hard",
      tip: "Aggressive brushing can damage gums and enamel. Use gentle, circular motions.",
      icon: <Heart className="w-4 h-4" />,
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      borderColor: "border-pink-200 dark:border-pink-800",
      textColor: "text-pink-600 dark:text-pink-400",
      iconBg: "bg-pink-500"
    },
    { 
      id: 7,
      title: "Stay Hydrated",
      tip: "Drinking water helps wash away food particles and bacteria, and prevents dry mouth.",
      icon: <Coffee className="w-4 h-4" />,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-500"
    }
  ];

  useEffect(() => {
    // Get streak data using utility functions
    const currentStreak = getCurrentStreak(habitData);
    setStreak(currentStreak);
    
    // Get longest streak
    const longest = getLongestStreak(habitData);
    setLongestStreak(longest);
    
    // Get today's progress using utility
    const progress = getTodayProgress(habitData);
    setTodayProgress(progress);
    
    // Get weekly activity using utility
    const weekly = getWeeklyActivity(habitData);
    setWeeklyActivity(weekly);
    
    // Set next milestone
    const milestones = [7, 30, 60, 90, 180, 365];
    const next = milestones.find(m => m > currentStreak) || 365;
    setNextMilestone(next);
    
    // Load scan history
    const scanHistory = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    setRecentScans(scanHistory.slice(0, 3));
    setTotalScans(scanHistory.length);
    
    if (scanHistory.length > 0) {
      const lastScan = new Date(scanHistory[0].date);
      const today = new Date();
      const diffDays = Math.floor((today - lastScan) / (1000 * 60 * 60 * 24));
      setLastScanDate(diffDays === 0 ? 'Today' : diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`);
    }
    
    // Load upcoming appointments from storage
    const appointments = storage.get('appointments', []);
    const upcoming = appointments
      .filter(apt => new Date(apt.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 2);
    setUpcomingAppointments(upcoming);
    
    // Set daily tip (rotates based on day of month)
    const dayOfMonth = new Date().getDate();
    const tipIndex = (dayOfMonth - 1) % dailyTips.length;
    setDailyTip(dailyTips[tipIndex]);
    
    // Trigger animation
    setIsAnimating(true);
  }, [habitData, user]);

  useEffect(() => {
    const translateAll = async () => {
      setTexts({
        title: await t("SmileStreak"),
        subtitle: await t("Build smarter dental habits with AI feedback"),
        currentStreak: await t("Current Streak"),
        days: await t("days"),
        keepItUp: await t("Keep it up!"),
        updateToday: await t("Update Today"),
        companion: await t("Your Dental Companion"),
        aiScan: await t("AI-powered scan feedback"),
        dailyStreak: await t("Daily streak tracking"),
        dentistFinder: await t("Dentist finder tool"),
        progressInsights: await t("Progress insights"),
        scanTeeth: await t("Scan Teeth"),
        aiFeedback: await t("AI brushing feedback"),
        streaks: await t("Streaks"),
        trackHabits: await t("Track daily habits"),
        findDentists: await t("Find Dentists"),
        nearbyCare: await t("Nearby care + insurance"),
        progress: await t("Progress"),
        reviewImprovements: await t("Review improvements"),
        longestStreak: await t("Longest Streak"),
        todayProgress: await t("Today's Progress"),
        nextMilestone: await t("Next Milestone"),
        dailyTip: await t("Daily Tip"),
        recentScans: await t("Recent Scans"),
        viewAll: await t("View All"),
        upcomingAppointments: await t("Upcoming Appointments"),
        weeklyActivity: await t("Weekly Activity"),
        totalScans: await t("Total Scans"),
        lastScan: await t("Last Scan"),
        goodMorning: await t("Good Morning"),
        goodAfternoon: await t("Good Afternoon"),
        goodEvening: await t("Good Evening"),
        welcomeBack: await t("Welcome Back")
      });
    };
    translateAll();
  }, [currentLanguage, t]);

  const go = (tab) => {
    if (typeof setActiveTab === "function") {
      setActiveTab(tab);
    }
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return texts.goodMorning || "Good Morning";
    if (hour < 18) return texts.goodAfternoon || "Good Afternoon";
    return texts.goodEvening || "Good Evening";
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50'
    }`}>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* WELCOME HEADER */}
        <div className={`flex items-center justify-between transition-all duration-700 ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div className="flex items-center gap-3">
            <img
              src="/icon-511.png"
              alt="SmileStreak logo"
              className="w-14 h-14 rounded-xl shadow-md object-cover"
            />
            <div>
              <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {getGreeting()}{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}
              </h2>
              <h1 className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent`}>
                {texts.title || "SmileStreak"}
              </h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => go("scan")}
              className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              title="Quick Scan"
            >
              <Camera className="w-5 h-5" />
            </button>
            <button
              onClick={() => go("today")}
              className="p-3 bg-white border-2 border-blue-200 text-blue-600 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              title="Quick Update"
            >
              <Calendar className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 gap-4">
          {/* STREAK CARD */}
          <div className={`relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white rounded-2xl shadow-xl p-5 transition-all duration-700 delay-100 ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
            <div className="relative">
              <div className="flex items-center gap-1 mb-2">
                <Flame className="w-4 h-4 text-orange-300" />
                <p className="text-xs font-medium opacity-90">{texts.currentStreak || "Current Streak"}</p>
              </div>
              <div className="flex items-end gap-1">
                <p className="text-3xl font-black">{streak}</p>
                <p className="text-sm font-semibold opacity-80 pb-1">{texts.days || "days"}</p>
              </div>
              {streak >= 7 && (
                <div className="flex items-center gap-1 mt-2 text-xs bg-white/20 rounded-full px-2 py-1 w-fit">
                  <Sparkles className="w-3 h-3" />
                  <span>{texts.keepItUp || "Keep it up!"}</span>
                </div>
              )}
            </div>
          </div>

          {/* LONGEST STREAK CARD */}
          <div className={`relative overflow-hidden bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-2xl shadow-xl p-5 transition-all duration-700 delay-150 ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
            <div className="relative">
              <div className="flex items-center gap-1 mb-2">
                <Award className="w-4 h-4 text-yellow-300" />
                <p className="text-xs font-medium opacity-90">{texts.longestStreak || "Longest Streak"}</p>
              </div>
              <div className="flex items-end gap-1">
                <p className="text-3xl font-black">{longestStreak}</p>
                <p className="text-sm font-semibold opacity-80 pb-1">{texts.days || "days"}</p>
              </div>
              {nextMilestone && (
                <p className="text-xs mt-2 opacity-80">
                  Next: {nextMilestone} days
                </p>
              )}
            </div>
          </div>
        </div>

        {/* TODAY'S PROGRESS BAR */}
        <div className={`bg-white dark:bg-white border border-blue-100 dark:border-blue-200 rounded-2xl shadow-lg p-5 transition-all duration-700 delay-200 ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900 dark:text-gray-900">{texts.todayProgress || "Today's Progress"}</h3>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-600">{todayProgress}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${todayProgress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-500">
            <span>Morning</span>
            <span>Evening</span>
          </div>
        </div>

        {/* DAILY TIP CARD */}
        {dailyTip && (
          <div className={`${dailyTip.bgColor} ${dailyTip.borderColor} border rounded-2xl shadow-lg p-5 transition-all duration-700 delay-250 ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 ${dailyTip.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 text-white`}>
                {dailyTip.icon}
              </div>
              <div>
                <h3 className={`font-bold text-gray-900 dark:text-gray-900 mb-1 ${dailyTip.textColor}`}>{dailyTip.title}</h3>
                <p className={`text-sm text-gray-600 dark:text-gray-600`}>{dailyTip.tip}</p>
              </div>
            </div>
          </div>
        )}

        {/* WEEKLY ACTIVITY CHART */}
        <div className={`bg-white dark:bg-white border border-blue-100 dark:border-blue-200 rounded-2xl shadow-lg p-5 transition-all duration-700 delay-300 ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <h3 className="font-bold text-gray-900 dark:text-gray-900 mb-4">{texts.weeklyActivity || "Weekly Activity"}</h3>
          <div className="flex justify-between items-end h-24 gap-1">
            {weeklyActivity.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex justify-center">
                  <div 
                    className="w-full max-w-[24px] bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg transition-all duration-500"
                    style={{ height: `${day.percentage}%`, minHeight: '4px' }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-500">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SCAN STATS */}
        <div className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-350 ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div className="bg-white dark:bg-white border border-blue-100 dark:border-blue-200 rounded-xl p-4 shadow-md">
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">{texts.totalScans || "Total Scans"}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-900">{totalScans}</p>
          </div>
          <div className="bg-white dark:bg-white border border-blue-100 dark:border-blue-200 rounded-xl p-4 shadow-md">
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">{texts.lastScan || "Last Scan"}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-900">{lastScanDate || "Never"}</p>
          </div>
        </div>

        {/* UPCOMING APPOINTMENTS */}
        {upcomingAppointments.length > 0 && (
          <div className={`bg-white dark:bg-white border border-blue-100 dark:border-blue-200 rounded-2xl shadow-lg p-5 transition-all duration-700 delay-400 ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <h3 className="font-bold text-gray-900 dark:text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-600" />
              {texts.upcomingAppointments || "Upcoming Appointments"}
            </h3>
            {upcomingAppointments.map((apt, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-900">{apt.dentist}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{new Date(apt.date).toLocaleDateString()}</p>
                </div>
                <button className="text-sm text-blue-600 dark:text-blue-600 font-semibold">View</button>
              </div>
            ))}
          </div>
        )}

        {/* RECENT SCANS */}
        {recentScans.length > 0 && (
          <div className={`bg-white dark:bg-white border border-blue-100 dark:border-blue-200 rounded-2xl shadow-lg p-5 transition-all duration-700 delay-450 ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-900 dark:text-gray-900">{texts.recentScans || "Recent Scans"}</h3>
              <button 
                onClick={() => go("scan")}
                className="text-sm text-blue-600 dark:text-blue-600 font-semibold flex items-center gap-1"
              >
                {texts.viewAll || "View All"} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {recentScans.map((scan, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={scan.image} alt="Scan" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-900">{scan.timestamp}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-1">{scan.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUICK ACTIONS GRID */}
        <div className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-500 ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <button
            onClick={() => go("scan")}
            className="group relative bg-white dark:bg-white border border-blue-100 dark:border-blue-200 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-left"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/10 dark:to-cyan-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-300" />
            <div className="relative space-y-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Scan className="w-5 h-5 text-white" />
              </div>
              <p className="font-bold text-gray-900 dark:text-gray-900">{texts.scanTeeth || "Scan Teeth"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">{texts.aiFeedback || "AI brushing feedback"}</p>
            </div>
          </button>

          <button
            onClick={() => go("today")}
            className="group relative bg-white dark:bg-white border border-blue-100 dark:border-blue-200 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-left"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/10 dark:to-cyan-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-300" />
            <div className="relative space-y-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <p className="font-bold text-gray-900 dark:text-gray-900">{texts.streaks || "Streaks"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">{texts.trackHabits || "Track daily habits"}</p>
            </div>
          </button>

          <button
            onClick={() => go("dentists")}
            className="group relative bg-white dark:bg-white border border-blue-100 dark:border-blue-200 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-left"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/10 dark:to-cyan-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-300" />
            <div className="relative space-y-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <p className="font-bold text-gray-900 dark:text-gray-900">{texts.findDentists || "Find Dentists"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">{texts.nearbyCare || "Nearby care + insurance"}</p>
            </div>
          </button>

          <button
            onClick={() => go("progress")}
            className="group relative bg-white dark:bg-white border border-blue-100 dark:border-blue-200 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-left"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/10 dark:to-cyan-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-300" />
            <div className="relative space-y-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="font-bold text-gray-900 dark:text-gray-900">{texts.progress || "Progress"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">{texts.reviewImprovements || "Review improvements"}</p>
            </div>
          </button>
        </div>

        {/* MOTIVATIONAL QUOTE */}
        <div className={`text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'} italic transition-all duration-700 delay-550 ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          "Every smile is unique. Every streak matters."
        </div>

      </div>
    </div>
  );
}
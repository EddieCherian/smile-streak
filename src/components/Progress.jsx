import WeeklyCalendar from "./WeeklyCalendar";
import { ACHIEVEMENTS } from "../data";
import { calculateStreaks } from "../utils/progress";
import { Trophy, Flame, Calendar, TrendingUp, Award, Lock, Sparkles } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { TranslationContext } from "../App";

export default function Progress({ habitData }) {
  const { t, currentLanguage } = useContext(TranslationContext);
  const [texts, setTexts] = useState({});
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  
  const days = Object.values(habitData || {});

  const completedDays = days.filter(
    (d) => d?.morning && d?.night && d?.floss
  ).length;

  const { currentStreak, longestStreak } = calculateStreaks(habitData || {});

  const totalDays = Object.keys(habitData || {}).filter(k => k !== "__lastRecoveryUsed").length;
  const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  const nextAchievement = ACHIEVEMENTS.find(a => completedDays < a.requirement);
  const daysUntilNext = nextAchievement ? nextAchievement.requirement - completedDays : 0;

  useEffect(() => {
    const translateAll = async () => {
      setTexts({
        yourProgress: await t("Your Progress"),
        trackJourney: await t("Track your dental care journey"),
        totalDays: await t("Total Days"),
        completionRate: await t("completion rate"),
        currentStreak: await t("Current Streak"),
        keepGoing: await t("Keep it going!"),
        startToday: await t("Start today!"),
        bestStreak: await t("Best Streak"),
        personalRecord: await t("Personal record"),
        achievements: await t("Achievements"),
        unlocked: await t("unlocked"),
        nextAchievement: await t("Next Achievement"),
        daysNeeded: await t("Days needed"),
        daysCompleted: await t("days completed"),
        days: await t("days"),
        awesome: await t("Awesome!"),
        completedMessage: await t("You've completed"),
        perfectDays: await t("perfect days of dental care. Keep up the amazing work!"),
        greatStart: await t("Great start!"),
        buildingMomentum: await t("Building momentum!"),
        onFire: await t("You're on fire!"),
        legendaryDedication: await t("Legendary dedication!"),
        maintainedPerfect: await t("You've maintained"),
        day: await t("day"),
        dentalCare: await t("of dental care")
      });
    };
    translateAll();
  }, [currentLanguage, t]);

  return (
    <section className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-6 h-6" />
            <h2 className="text-2xl font-black">{texts.yourProgress || "Your Progress"}</h2>
          </div>
          <p className="text-sm opacity-90">{texts.trackJourney || "Track your dental care journey"}</p>
        </div>
      </div>

      {/* CALENDAR */}
      <div className="bg-white rounded-3xl p-5 shadow-lg border border-blue-100">
        <WeeklyCalendar habitData={habitData || {}} />
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={<Calendar className="w-5 h-5 text-blue-500" />}
          label={texts.totalDays || "Total Days"}
          value={completedDays}
          color="blue"
          subtitle={`${completionRate}% ${texts.completionRate || "completion rate"}`}
        />
        <StatCard 
          icon={<Flame className="w-5 h-5 text-orange-500" />}
          label={texts.currentStreak || "Current Streak"}
          value={currentStreak}
          color="orange"
          subtitle={currentStreak > 0 ? (texts.keepGoing || "Keep it going!") : (texts.startToday || "Start today!")}
        />
        <StatCard 
          icon={<Trophy className="w-5 h-5 text-yellow-500" />}
          label={texts.bestStreak || "Best Streak"}
          value={longestStreak}
          color="yellow"
          subtitle={texts.personalRecord || "Personal record"}
        />
        <StatCard 
          icon={<Award className="w-5 h-5 text-purple-500" />}
          label={texts.achievements || "Achievements"}
          value={ACHIEVEMENTS.filter(a => completedDays >= a.requirement).length}
          color="purple"
          subtitle={`/ ${ACHIEVEMENTS.length} ${texts.unlocked || "unlocked"}`}
        />
      </div>

      {/* Next Achievement Tracker */}
      {nextAchievement && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <p className="font-bold text-gray-900">{texts.nextAchievement || "Next Achievement"}</p>
              </div>
              <p className="text-2xl mb-1">{nextAchievement.icon}</p>
              <p className="text-sm font-semibold text-gray-700">{nextAchievement.label}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">{texts.daysNeeded || "Days needed"}</p>
              <p className="text-3xl font-black text-purple-600">{daysUntilNext}</p>
            </div>
          </div>
          
          <div className="relative w-full h-3 bg-purple-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${(completedDays / nextAchievement.requirement) * 100}%` }}
            />
          </div>
          <p className="text-xs text-purple-700 mt-2 text-center font-medium">
            {completedDays} / {nextAchievement.requirement} {texts.daysCompleted || "days completed"}
          </p>
        </div>
      )}

      {/* ACHIEVEMENTS */}
      <div className="bg-white p-6 rounded-3xl shadow-lg border border-blue-100">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-gray-900">{texts.achievements || "Achievements"}</h3>
          </div>
          <p className="text-sm text-gray-500">
            {ACHIEVEMENTS.filter(a => completedDays >= a.requirement).length} / {ACHIEVEMENTS.length}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = completedDays >= a.requirement;

            return (
              <button
                key={a.id}
                onClick={() => setSelectedAchievement(unlocked ? a : null)}
                className={`group relative p-4 rounded-2xl text-center transition-all duration-200 ${
                  unlocked
                    ? "bg-gradient-to-br from-yellow-100 to-orange-100 shadow-md hover:shadow-lg hover:scale-105 cursor-pointer"
                    : "bg-gray-100 opacity-50 cursor-not-allowed"
                }`}
              >
                {unlocked ? (
                  <>
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                      {a.icon}
                    </div>
                    <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </>
                ) : (
                  <>
                    <Lock className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <div className="text-2xl mb-2 filter grayscale">
                      {a.icon}
                    </div>
                  </>
                )}
                <p className="text-xs font-semibold text-gray-700">
                  {a.label}
                </p>
                {!unlocked && (
                  <p className="text-xs text-gray-500 mt-1">
                    {a.requirement} {texts.days || "days"}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setSelectedAchievement(null)}
        >
          <div 
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-[scaleBounce_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">{selectedAchievement.icon}</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                {selectedAchievement.label}
              </h3>
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl px-4 py-2 inline-block mb-4">
                <p className="text-sm font-semibold text-gray-700">
                  {texts.unlocked || "Unlocked"} at {selectedAchievement.requirement} {texts.days || "days"}
                </p>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                {texts.completedMessage || "You've completed"} {completedDays} {texts.perfectDays || "perfect days of dental care. Keep up the amazing work!"}
              </p>
              <button
                onClick={() => setSelectedAchievement(null)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                {texts.awesome || "Awesome!"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Footer */}
      {completedDays > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 text-center">
          <Sparkles className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="font-bold text-gray-900 mb-1">
            {completedDays === 1 
              ? (texts.greatStart || "Great start!") 
              : completedDays < 7 
              ? (texts.buildingMomentum || "Building momentum!") 
              : completedDays < 30 
              ? (texts.onFire || "You're on fire!") 
              : (texts.legendaryDedication || "Legendary dedication!")}
          </p>
          <p className="text-sm text-gray-600">
            {texts.maintainedPerfect || "You've maintained"} {completedDays} {completedDays === 1 ? (texts.day || "day") : (texts.days || "days")} {texts.dentalCare || "of dental care"}
          </p>
        </div>
      )}
    </section>
  );
}

function StatCard({ icon, label, value, color, subtitle }) {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500",
    orange: "from-orange-500 to-red-500",
    yellow: "from-yellow-500 to-orange-500",
    purple: "from-purple-500 to-pink-500",
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-black text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

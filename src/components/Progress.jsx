import WeeklyCalendar from "./WeeklyCalendar";
import { ACHIEVEMENTS } from "../data";
import { calculateStreaks } from "../utils/progress";
import { Trophy, Flame, Calendar, TrendingUp, Award, Lock, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Progress({ habitData }) {
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  
  const days = Object.values(habitData || {});

  const completedDays = days.filter(
    (d) => d?.morning && d?.night && d?.floss
  ).length;

  const { currentStreak, longestStreak } = calculateStreaks(habitData || {});

  // Calculate completion rate
  const totalDays = Object.keys(habitData || {}).filter(k => k !== "__lastRecoveryUsed").length;
  const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  // Calculate next achievement
  const nextAchievement = ACHIEVEMENTS.find(a => completedDays < a.requirement);
  const daysUntilNext = nextAchievement ? nextAchievement.requirement - completedDays : 0;

  return (
    <section className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-6 h-6" />
            <h2 className="text-2xl font-black">Your Progress</h2>
          </div>
          <p className="text-sm opacity-90">Track your dental care journey</p>
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
          label="Total Days" 
          value={completedDays}
          color="blue"
          subtitle={`${completionRate}% completion rate`}
        />
        <StatCard 
          icon={<Flame className="w-5 h-5 text-orange-500" />}
          label="Current Streak" 
          value={currentStreak}
          color="orange"
          subtitle={currentStreak > 0 ? "Keep it going!" : "Start today!"}
        />
        <StatCard 
          icon={<Trophy className="w-5 h-5 text-yellow-500" />}
          label="Best Streak" 
          value={longestStreak}
          color="yellow"
          subtitle="Personal record"
        />
        <StatCard 
          icon={<Award className="w-5 h-5 text-purple-500" />}
          label="Achievements" 
          value={ACHIEVEMENTS.filter(a => completedDays >= a.requirement).length}
          color="purple"
          subtitle={`/ ${ACHIEVEMENTS.length} unlocked`}
        />
      </div>

      {/* Next Achievement Tracker */}
      {nextAchievement && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <p className="font-bold text-gray-900">Next Achievement</p>
              </div>
              <p className="text-2xl mb-1">{nextAchievement.icon}</p>
              <p className="text-sm font-semibold text-gray-700">{nextAchievement.label}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Days needed</p>
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
            {completedDays} / {nextAchievement.requirement} days completed
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
            <h3 className="font-bold text-gray-900">Achievements</h3>
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
                    {a.requirement} days
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
                  Unlocked at {selectedAchievement.requirement} days
                </p>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                You've completed {completedDays} perfect days of dental care. Keep up the amazing work!
              </p>
              <button
                onClick={() => setSelectedAchievement(null)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Awesome!
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
            {completedDays === 1 ? "Great start!" : completedDays < 7 ? "Building momentum!" : completedDays < 30 ? "You're on fire!" : "Legendary dedication!"}
          </p>
          <p className="text-sm text-gray-600">
            You've maintained {completedDays} perfect {completedDays === 1 ? "day" : "days"} of dental care
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

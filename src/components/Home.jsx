import { useEffect, useState } from "react";
import { Scan, Calendar, MapPin, TrendingUp, Sparkles, Flame } from "lucide-react";
import { getCurrentStreak } from "../utils/streak";

export default function Home({ setActiveTab, user, habitData }) {
  const [streak, setStreak] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Get the current streak from the streak utility
    const currentStreak = getCurrentStreak(habitData);
    setStreak(currentStreak);
    
    // Trigger animation on mount
    setIsAnimating(true);
  }, [habitData, user]); // Re-run when habitData or user changes

  const go = (tab) => {
    if (typeof setActiveTab === "function") {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* HEADER */}
        <div className={`flex items-center gap-4 bg-white rounded-2xl shadow-lg p-5 border border-blue-100 transition-all duration-700 ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div className="relative">
            <img
              src="/icon-511.png"
              alt="SmileStreak logo"
              className="w-14 h-14 rounded-xl shadow-md object-cover"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              SmileStreak
            </h1>
            <p className="text-sm text-gray-600">
              Build smarter dental habits with AI feedback
            </p>
          </div>
        </div>

        {/* STREAK CARD - MORE EXCITING */}
        <div className={`relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white rounded-3xl shadow-2xl p-8 transition-all duration-700 delay-100 ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
          
          <div className="relative flex justify-between items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-300 animate-pulse" />
                <p className="text-sm font-medium opacity-90">Current Streak</p>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-5xl font-black tracking-tight">{streak}</p>
                <p className="text-2xl font-semibold opacity-80 pb-1">days</p>
              </div>
              {streak >= 7 && (
                <div className="flex items-center gap-1 text-xs bg-white/20 rounded-full px-3 py-1 w-fit">
                  <Sparkles className="w-3 h-3" />
                  <span>Keep it up!</span>
                </div>
              )}
            </div>
            
            <button
              onClick={() => go("today")}
              className="group relative bg-white text-blue-600 text-sm font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <span className="relative z-10">Update Today</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>

        {/* FEATURE SUMMARY - MORE VISUAL */}
        <div className={`bg-white border border-blue-100 rounded-2xl shadow-lg p-6 space-y-4 transition-all duration-700 delay-200 ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-bold text-gray-900">Your Dental Companion</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2 text-sm">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
              <span className="text-gray-700">AI-powered scan feedback</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-cyan-500" />
              </div>
              <span className="text-gray-700">Daily streak tracking</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
              <span className="text-gray-700">Dentist finder tool</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-cyan-500" />
              </div>
              <span className="text-gray-700">Progress insights</span>
            </div>
          </div>
        </div>

        {/* NAV GRID - WITH ICONS & BETTER HOVER */}
        <div className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-300 ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>

          <button
            onClick={() => go("scan")}
            className="group relative bg-white border border-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-300" />
            <div className="relative space-y-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Scan className="w-5 h-5 text-white" />
              </div>
              <p className="font-bold text-gray-900">Scan Teeth</p>
              <p className="text-xs text-gray-500">AI brushing feedback</p>
            </div>
          </button>

          <button
            onClick={() => go("today")}
            className="group relative bg-white border border-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-300" />
            <div className="relative space-y-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <p className="font-bold text-gray-900">Streaks</p>
              <p className="text-xs text-gray-500">Track daily habits</p>
            </div>
          </button>

          <button
            onClick={() => go("dentists")}
            className="group relative bg-white border border-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-300" />
            <div className="relative space-y-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <p className="font-bold text-gray-900">Find Dentists</p>
              <p className="text-xs text-gray-500">Nearby care + insurance</p>
            </div>
          </button>

          <button
            onClick={() => go("progress")}
            className="group relative bg-white border border-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-300" />
            <div className="relative space-y-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="font-bold text-gray-900">Progress</p>
              <p className="text-xs text-gray-500">Review improvements</p>
            </div>
          </button>

        </div>

      </div>
    </div>
  );
}

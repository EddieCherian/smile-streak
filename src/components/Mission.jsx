import { Heart, Shield, Target, Users, Lightbulb, Mail, Github, Award, Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function Mission() {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-6 h-6" />
            <h2 className="text-2xl font-black">Our Mission</h2>
          </div>
          <p className="text-sm opacity-90">Building better dental habits, together</p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-white p-6 rounded-3xl shadow-lg border border-blue-100">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-2">Why Smile Streak Exists</h3>
          </div>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          Smile Streak was built to help people develop consistent oral health
          habits without guilt, pressure, or misinformation.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          Rather than focusing on perfection or streak anxiety, the goal is to
          encourage sustainable routines that align with real human behavior
          and evidence-based dental guidance.
        </p>
      </div>

      {/* The Problem We're Solving */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-3xl p-6 shadow-lg">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-black text-gray-900">The Real Problem</h3>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          Many dental health apps focus heavily on reminders and streaks, but
          fail to address why habits break down in the first place. Missed days
          are often caused by stress, schedule changes, fatigue, or lack of
          awareness — not lack of motivation.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          Smile Streak was created to emphasize reflection, pattern recognition,
          and long-term progress over short-term perfection. By helping users
          understand their habits, the app aims to make healthy routines easier
          to maintain over time.
        </p>
      </div>

      {/* Design Principles */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-black text-gray-900">Our Design Principles</h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {[
            { icon: <Lightbulb className="w-4 h-4" />, text: "Education over diagnosis", color: "blue" },
            { icon: <Target className="w-4 h-4" />, text: "Trends over daily pressure", color: "green" },
            { icon: <Heart className="w-4 h-4" />, text: "Reflection over punishment", color: "pink" },
            { icon: <Shield className="w-4 h-4" />, text: "Privacy-first, local-only data storage", color: "purple" },
            { icon: <Sparkles className="w-4 h-4" />, text: "Insights shown only when data is meaningful", color: "cyan" },
            { icon: <CheckCircle2 className="w-4 h-4" />, text: "Transparency about limitations and uncertainty", color: "orange" }
          ].map((principle, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl bg-${principle.color}-50 border border-${principle.color}-200`}>
              <div className={`text-${principle.color}-600`}>{principle.icon}</div>
              <p className="text-sm text-gray-700 font-medium">{principle.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Research-Informed */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 shadow-lg border-2 border-purple-200">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-black text-gray-900">Research-Informed Design</h3>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          The structure of this app is informed by published dental research and
          public health guidance from organizations such as the American Dental
          Association and the Centers for Disease Control and Prevention.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          Habit tracking, reflection prompts, and delayed insights are designed
          to prioritize consistency, reduce cognitive overload, and avoid
          drawing conclusions from insufficient data.
        </p>
      </div>
      
      {/* Get Involved */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
        <h3 className="text-lg font-black text-gray-900 mb-4">Get Involved</h3>
        <div className="space-y-3">
          <button
            onClick={() => setShowFeedback(true)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900 text-sm">Share Feedback</p>
                <p className="text-xs text-gray-600">Help us improve the app</p>
              </div>
            </div>
          </button>

          <a
            href="https://github.com/EddieCherian/smile-streak"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Github className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900 text-sm">Open Source</p>
                <p className="text-xs text-gray-600">View code on GitHub</p>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 animate-[scaleBounce_0.3s_ease-out]">
            <h3 className="text-xl font-black text-gray-900 mb-4">Share Your Feedback</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your input helps make Smile Streak better for everyone. What would you like to see improved?
            </p>
            <textarea
              id="feedbackBox"
              className="w-full h-32 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none resize-none"
              placeholder="Share your thoughts, suggestions, or report issues..."
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowFeedback(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const msg = document.getElementById("feedbackBox")?.value || "";
                  const subject = encodeURIComponent("Smile Streak Feedback");
                  const body = encodeURIComponent(msg);
                  window.location.href = `mailto:edwincherianj@gmail.com?subject=${subject}&body=${body}`;
                  setShowFeedback(false);
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:shadow-lg transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-yellow-50 p-6 rounded-3xl border-2 border-yellow-200 shadow-lg">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-gray-900 text-sm mb-2">Medical Disclaimer</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Smile Streak is designed for education and habit awareness only. It does not provide medical diagnosis or treatment recommendations. Users should always consult a licensed dental professional for personalized advice or concerns about their oral health.
            </p>
          </div>
        </div>
      </div>

      {/* Version & Credits */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-400 mb-1">Smile Streak v1.0.0</p>
        <p className="text-xs text-gray-400">Made with ❤️ for better dental health</p>
      </div>
    </div>
  );
}

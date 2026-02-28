import { TIPS } from "../data";
import { Lightbulb, ExternalLink, XCircle, CheckCircle, AlertCircle, BookOpen, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";

// Myth Busters Feature - Interactive Q&A
const MYTHS = [
  {
    id: 1,
    myth: "You should rinse your mouth with water right after brushing",
    truth: "False! Wait 30 minutes before rinsing. Toothpaste needs time to work its magic.",
    icon: "💧",
    isMyth: true
  },
  {
    id: 2,
    myth: "Whitening toothpaste damages your enamel",
    truth: "False! ADA-approved whitening toothpaste is safe when used as directed.",
    icon: "✨",
    isMyth: true
  },
  {
    id: 3,
    myth: "You need to brush harder to clean better",
    truth: "False! Gentle brushing is more effective and won't damage your gums.",
    icon: "🪥",
    isMyth: true
  },
  {
    id: 4,
    myth: "Flossing once a day is recommended by dentists",
    truth: "True! Daily flossing removes plaque between teeth that brushing can't reach.",
    icon: "🧵",
    isMyth: false
  },
  {
    id: 5,
    myth: "Sugar-free soda is safe for your teeth",
    truth: "False! The acid in soda (even sugar-free) erodes enamel over time.",
    icon: "🥤",
    isMyth: true
  },
  {
    id: 6,
    myth: "Electric toothbrushes clean better than manual ones",
    truth: "True! Studies show electric brushes reduce plaque by 21% more than manual.",
    icon: "⚡",
    isMyth: false
  }
];

export default function Tips() {
  const [selectedMyth, setSelectedMyth] = useState(null);
  const [revealedMyths, setRevealedMyths] = useState(new Set());
  const [filterCategory, setFilterCategory] = useState("all");

  const handleMythClick = (mythId) => {
    setSelectedMyth(mythId);
    setRevealedMyths(prev => new Set([...prev, mythId]));
  };

  // Enhanced tips with categories
  const categorizedTips = TIPS.map(tip => ({
    ...tip,
    category: tip.category || "general"
  }));

  const categories = ["all", ...new Set(categorizedTips.map(t => t.category))];

  const filteredTips = filterCategory === "all" 
    ? categorizedTips 
    : categorizedTips.filter(t => t.category === filterCategory);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-6 h-6" />
            <h2 className="text-2xl font-black">Dental Tips & Facts</h2>
          </div>
          <p className="text-sm opacity-90">Expert advice backed by science</p>
        </div>
      </div>

      {/* MYTH BUSTERS - Interactive Feature */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 shadow-lg border-2 border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-gray-900">Myth Busters</h3>
            <p className="text-xs text-gray-600">Test your dental knowledge!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {MYTHS.map((item) => {
            const isRevealed = revealedMyths.has(item.id);
            const isSelected = selectedMyth === item.id;

            return (
              <button
                key={item.id}
                onClick={() => !isRevealed && handleMythClick(item.id)}
                className={`text-left p-4 rounded-2xl border-2 transition-all duration-300 ${
                  isRevealed
                    ? item.isMyth
                      ? "bg-red-50 border-red-300"
                      : "bg-green-50 border-green-300"
                    : "bg-white border-purple-200 hover:border-purple-400 hover:shadow-md cursor-pointer"
                } ${isSelected && !isRevealed ? "scale-[1.02] shadow-lg" : ""}`}
                disabled={isRevealed}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm mb-2">
                      {item.myth}
                    </p>
                    
                    {isRevealed ? (
                      <div className={`flex items-start gap-2 p-3 rounded-xl ${
                        item.isMyth ? "bg-red-100" : "bg-green-100"
                      }`}>
                        {item.isMyth ? (
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className={`text-xs font-bold mb-1 ${
                            item.isMyth ? "text-red-700" : "text-green-700"
                          }`}>
                            {item.isMyth ? "MYTH!" : "TRUE!"}
                          </p>
                          <p className="text-xs text-gray-700">{item.truth}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-purple-600 font-medium">
                        Tap to reveal the truth →
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 bg-white/50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-600">
            <span className="font-semibold">{revealedMyths.size}</span> / {MYTHS.length} revealed
          </p>
        </div>
      </div>

      {/* Daily Pro Tip */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 mb-1">💡 Pro Tip of the Day</p>
            <p className="text-sm text-gray-700">
              Brush your teeth at a 45-degree angle toward your gumline. This removes more plaque and prevents gum disease!
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs (if you add categories to TIPS data) */}
      {categories.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Tips Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTips.map((tip, index) => (
          <div
            key={tip.id}
            className="group bg-white p-5 rounded-2xl shadow-md border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                {tip.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">{tip.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{tip.content}</p>
              </div>
            </div>
            
            {tip.sourceLink && (
              <a
                href={tip.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium mt-2"
              >
                <span>Source: {tip.source}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Learn More Section */}
      <div className="bg-white p-6 rounded-3xl shadow-lg border border-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Learn More</h2>
        </div>
        <div className="space-y-3">
          {[
            { name: "American Dental Association", url: "https://www.ada.org/resources/research/science-and-research-institute/oral-health-topics", desc: "Comprehensive oral health research" },
            { name: "CDC Oral Health", url: "https://www.cdc.gov/oralhealth/basics/index.html", desc: "Public health guidelines and basics" },
            { name: "WHO Oral Health", url: "https://www.who.int/news-room/fact-sheets/detail/oral-health", desc: "Global oral health statistics" }
          ].map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors group"
            >
              <div>
                <p className="font-semibold text-gray-900 text-sm">{link.name}</p>
                <p className="text-xs text-gray-600">{link.desc}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </a>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-gray-700 leading-relaxed">
            <strong className="text-gray-900">Important:</strong> These tips are for prevention and education only, based on published dental research. This app does not provide medical diagnosis or treatment recommendations. Always consult with a licensed dental professional for personalized advice, treatment, or if you have concerns about your oral health.
          </div>
        </div>
      </div>
    </div>
  );
}

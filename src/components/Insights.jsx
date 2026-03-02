import { generateInsights } from "../utils/insights";
import { useState, useContext, useEffect } from "react";
import { TrendingUp, TrendingDown, Target, Award, Calendar, Clock, Zap, Brain, Heart, AlertCircle, CheckCircle2, Flame, Trophy, BarChart3, Activity, Sun, Moon, Sparkles } from "lucide-react";
import { TranslationContext } from "../App";

export default function Insights({ habitData }) {
  const { t, currentLanguage, translating } = useContext(TranslationContext);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [translatedText, setTranslatedText] = useState({});

  // Translation keys
  const translationKeys = {
    title: "Smart Insights",
    subtitle: "AI-powered analysis of your habits",
    noDataTitle: "No Data Yet",
    noDataDesc: "Start tracking your dental habits to see personalized insights and analytics!",
    healthScore: "Health Score",
    scoreBreakdown: "Score Breakdown",
    completionRate: "Completion Rate",
    consistency: "Consistency",
    balance: "Balance",
    improvement: "Improvement",
    daysTracked: "Days Tracked",
    perfectDays: "Perfect Days",
    bestStreak: "Best Streak",
    timePerformance: "Time-of-Day Performance",
    morning: "Morning",
    night: "Night",
    yourStrongestTime: "Your strongest time!",
    aiPredictions: "AI Predictions & Tips",
    howYouCompare: "How You Compare",
    yourScore: "Your Score",
    needsWork: "Needs Work",
    good: "Good",
    excellent: "Excellent",
    detectedPatterns: "Detected Patterns",
    mostMissedTask: "Most Missed Task",
    mostMissedTaskDesc: "{task} is your most commonly skipped task",
    challengingDay: "Challenging Day",
    challengingDayDesc: "{day}s are when you're most likely to miss tasks",
    patternDetectionNote: "Pattern detection improves after {days} days of tracking",
    overview: "Overview",
    motivationExcellent: "You're crushing it! Keep up this amazing routine.",
    motivationGood: "You're building great habits. Small improvements add up!",
    motivationNeedsWork: "Every day is a new opportunity. You've got this! 💪",
    completionRateDesc: "Tasks completed vs tracked",
    consistencyDesc: "Streak performance",
    balanceDesc: "Even task distribution",
    improvementDesc: "Recent vs past performance",
    
    // Score status labels
    scoreExcellent: "Excellent",
    scoreGreat: "Great",
    scoreGood: "Good",
    scoreFair: "Fair",
    scoreNeedsWork: "Needs Work",
    
    // Health score descriptions
    healthDescExcellent: "Outstanding dental care routine!",
    healthDescGood: "Good habits, room to improve",
    healthDescNeedsWork: "Let's build better consistency together",
    
    // Predictions
    momentumTitle: "Momentum Building",
    momentumMessage: "You're on a {streak}-day streak! Keep this up for {days} more days to hit a week.",
    watchOutTitle: "Watch Out",
    watchOutMessage: "{day}s are challenging for you. Set an extra reminder for this day.",
    morningOpportunityTitle: "Morning Opportunity",
    morningOpportunityMessage: "Morning brushing needs attention. Try placing your toothbrush next to your phone charger.",
    excellenceTitle: "Excellence Achieved",
    excellenceMessage: "Your dental care is in the top 20% of users. Your dentist will be impressed!",
    
    // Benchmark ranges
    needsWorkRange: "<50%",
    goodRange: "50-80%",
    excellentRange: "80%+",
    
    dayStreak: "Day Streak!"
  };

  // Safety check for habitData
  if (!habitData || Object.keys(habitData).length === 0) {
    return (
      <div className="space-y-6 pb-8">
        <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-6 h-6" />
              <h2 className="text-2xl font-black">{translatedText.title || translationKeys.title}</h2>
            </div>
            <p className="text-sm opacity-90">{translatedText.subtitle || translationKeys.subtitle}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">{translatedText.noDataTitle || translationKeys.noDataTitle}</h3>
          <p className="text-sm text-gray-600">
            {translatedText.noDataDesc || translationKeys.noDataDesc}
          </p>
        </div>
      </div>
    );
  }

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      const translations = {};
      for (const [key, value] of Object.entries(translationKeys)) {
        translations[key] = await t(value);
      }
      setTranslatedText(translations);
    };
    
    loadTranslations();
  }, [currentLanguage, t]);

  const insights = generateInsights(habitData);

  // Calculate health score (0-100)
  const calculateHealthScore = () => {
    try {
      const weights = {
        completionRate: 0.4,
        consistency: 0.3,
        balance: 0.2,
        improvement: 0.1
      };

      const completionScore = insights.completionRate || 0;
      
      // Consistency: how many days in a row completed
      const dates = Object.keys(habitData).filter(k => !k.startsWith("__")).sort();
      
      if (dates.length === 0) {
        return {
          total: 0,
          breakdown: { completion: 0, consistency: 0, balance: 0, improvement: 0 },
          streak: 0,
          maxStreak: 0
        };
      }
      
      let maxStreak = 0;
      let tempStreak = 0;
      
      dates.forEach(date => {
        const d = habitData[date];
        if (d?.morning && d?.night && d?.floss) {
          tempStreak++;
          maxStreak = Math.max(maxStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      });
      
      const currentStreak = tempStreak;
      const consistencyScore = Math.min((maxStreak / 30) * 100, 100);

      // Balance: how evenly distributed are completions across tasks
      const morningRate = insights.taskStats?.morning || 0;
      const nightRate = insights.taskStats?.night || 0;
      const flossRate = insights.taskStats?.floss || 0;
      const avgRate = (morningRate + nightRate + flossRate) / 3;
      const variance = ((Math.abs(morningRate - avgRate) + Math.abs(nightRate - avgRate) + Math.abs(flossRate - avgRate)) / 3);
      const balanceScore = Math.max(100 - variance, 0);

      // Improvement: trend over time
      const recentDays = dates.slice(-7);
      const olderDays = dates.slice(-14, -7);
      
      const recentCompletion = recentDays.length > 0 ? (recentDays.filter(d => {
        const day = habitData[d];
        return day?.morning && day?.night && day?.floss;
      }).length / recentDays.length * 100) : 0;
      
      const olderCompletion = olderDays.length > 0 ? (olderDays.filter(d => {
        const day = habitData[d];
        return day?.morning && day?.night && day?.floss;
      }).length / olderDays.length * 100) : recentCompletion;
      
      const improvementScore = Math.min(Math.max(50 + (recentCompletion - olderCompletion), 0), 100);

      const totalScore = Math.round(
        completionScore * weights.completionRate +
        consistencyScore * weights.consistency +
        balanceScore * weights.balance +
        improvementScore * weights.improvement
      );

      return {
        total: isNaN(totalScore) ? 0 : totalScore,
        breakdown: {
          completion: isNaN(completionScore) ? 0 : Math.round(completionScore),
          consistency: isNaN(consistencyScore) ? 0 : Math.round(consistencyScore),
          balance: isNaN(balanceScore) ? 0 : Math.round(balanceScore),
          improvement: isNaN(improvementScore) ? 0 : Math.round(improvementScore)
        },
        streak: currentStreak,
        maxStreak
      };
    } catch (error) {
      console.error("Error calculating health score:", error);
      return {
        total: 0,
        breakdown: { completion: 0, consistency: 0, balance: 0, improvement: 0 },
        streak: 0,
        maxStreak: 0
      };
    }
  };

  const healthScore = calculateHealthScore();

  // Time-of-day analysis
  const getTimePatterns = () => {
    try {
      const dates = Object.keys(habitData).filter(k => !k.startsWith("__"));
      
      if (dates.length === 0) {
        return { morningRate: 0, nightRate: 0, betterTime: 'morning' };
      }
      
      let morningSuccessful = 0;
      let nightSuccessful = 0;
      
      dates.forEach(date => {
        const d = habitData[date];
        if (d?.morning) morningSuccessful++;
        if (d?.night) nightSuccessful++;
      });

      return {
        morningRate: Math.round((morningSuccessful / dates.length) * 100) || 0,
        nightRate: Math.round((nightSuccessful / dates.length) * 100) || 0,
        betterTime: morningSuccessful >= nightSuccessful ? 'morning' : 'night'
      };
    } catch (error) {
      console.error("Error getting time patterns:", error);
      return { morningRate: 0, nightRate: 0, betterTime: 'morning' };
    }
  };

  const timePatterns = getTimePatterns();

  // Predictive insights with translations
  const getPredictions = () => {
    try {
      const predictions = [];
      
      if (healthScore.streak >= 3) {
        const message = (translatedText.momentumMessage || translationKeys.momentumMessage)
          .replace('{streak}', healthScore.streak)
          .replace('{days}', Math.max(7 - healthScore.streak, 0));
          
        predictions.push({
          type: 'success',
          icon: <Flame className="w-5 h-5 text-orange-500" />,
          title: translatedText.momentumTitle || translationKeys.momentumTitle,
          message: message
        });
      }

      if (insights.mostMissedDay) {
        const message = (translatedText.watchOutMessage || translationKeys.watchOutMessage)
          .replace('{day}', insights.mostMissedDay);
          
        predictions.push({
          type: 'warning',
          icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
          title: translatedText.watchOutTitle || translationKeys.watchOutTitle,
          message: message
        });
      }

      if (timePatterns.morningRate < 60) {
        predictions.push({
          type: 'tip',
          icon: <Sun className="w-5 h-5 text-orange-400" />,
          title: translatedText.morningOpportunityTitle || translationKeys.morningOpportunityTitle,
          message: translatedText.morningOpportunityMessage || translationKeys.morningOpportunityMessage
        });
      }

      if (healthScore.total >= 80) {
        predictions.push({
          type: 'success',
          icon: <Trophy className="w-5 h-5 text-yellow-500" />,
          title: translatedText.excellenceTitle || translationKeys.excellenceTitle,
          message: translatedText.excellenceMessage || translationKeys.excellenceMessage
        });
      }

      return predictions;
    } catch (error) {
      console.error("Error getting predictions:", error);
      return [];
    }
  };

  const predictions = getPredictions();

  // Comparative benchmarks
  const getBenchmarks = () => {
    return {
      excellent: 90,
      good: 70,
      needsWork: 50,
      userScore: insights.completionRate || 0
    };
  };

  const benchmarks = getBenchmarks();

  // Get health score color and label with translations
  const getScoreStatus = (score) => {
    if (score >= 90) return { 
      label: translatedText.scoreExcellent || translationKeys.scoreExcellent, 
      color: 'green', 
      gradient: 'from-green-400 to-emerald-500' 
    };
    if (score >= 75) return { 
      label: translatedText.scoreGreat || translationKeys.scoreGreat, 
      color: 'blue', 
      gradient: 'from-blue-400 to-cyan-500' 
    };
    if (score >= 60) return { 
      label: translatedText.scoreGood || translationKeys.scoreGood, 
      color: 'yellow', 
      gradient: 'from-yellow-400 to-orange-400' 
    };
    if (score >= 40) return { 
      label: translatedText.scoreFair || translationKeys.scoreFair, 
      color: 'orange', 
      gradient: 'from-orange-400 to-red-400' 
    };
    return { 
      label: translatedText.scoreNeedsWork || translationKeys.scoreNeedsWork, 
      color: 'red', 
      gradient: 'from-red-400 to-pink-500' 
    };
  };

  const scoreStatus = getScoreStatus(healthScore.total);

  // Show loading state while translating
  if (translating || Object.keys(translatedText).length === 0) {
    return (
      <div className="space-y-6 pb-8">
        <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl">
          <div className="animate-pulse flex items-center gap-2">
            <Brain className="w-6 h-6" />
            <h2 className="text-2xl font-black">Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-6 h-6" />
            <h2 className="text-2xl font-black">{translatedText.title}</h2>
          </div>
          <p className="text-sm opacity-90">{translatedText.subtitle}</p>
        </div>
      </div>

      {/* Health Score - Hero Section */}
      <div className={`relative rounded-3xl p-8 shadow-2xl overflow-hidden bg-gradient-to-br ${scoreStatus.gradient}`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16" />
        
        <div className="relative z-10 text-center text-white">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="white"
                  strokeOpacity="0.2"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="white"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - healthScore.total / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <p className="text-5xl font-black">{healthScore.total}</p>
                  <p className="text-xs opacity-80">/ 100</p>
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="text-2xl font-black mb-2">{translatedText.healthScore}: {scoreStatus.label}</h3>
          <p className="text-sm opacity-90">
            {healthScore.total >= 80 ? (translatedText.healthDescExcellent || translationKeys.healthDescExcellent) :
             healthScore.total >= 60 ? (translatedText.healthDescGood || translationKeys.healthDescGood) :
             (translatedText.healthDescNeedsWork || translationKeys.healthDescNeedsWork)}
          </p>

          {healthScore.streak > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Flame className="w-5 h-5" />
              <span className="font-bold">{healthScore.streak} {translatedText.dayStreak}</span>
            </div>
          )}
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
        <h3 className="font-black text-gray-900 mb-4">{translatedText.scoreBreakdown}</h3>
        
        <div className="space-y-4">
          {[
            { label: translatedText.completionRate, value: healthScore.breakdown.completion, icon: <Target className="w-5 h-5 text-blue-500" />, desc: translatedText.completionRateDesc },
            { label: translatedText.consistency, value: healthScore.breakdown.consistency, icon: <Activity className="w-5 h-5 text-green-500" />, desc: translatedText.consistencyDesc },
            { label: translatedText.balance, value: healthScore.breakdown.balance, icon: <BarChart3 className="w-5 h-5 text-purple-500" />, desc: translatedText.balanceDesc },
            { label: translatedText.improvement, value: healthScore.breakdown.improvement, icon: <TrendingUp className="w-5 h-5 text-cyan-500" />, desc: translatedText.improvementDesc }
          ].map((metric) => (
            <div key={metric.label} className="group cursor-pointer" onClick={() => setSelectedMetric(metric)}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {metric.icon}
                  <span className="font-semibold text-gray-900">{metric.label}</span>
                </div>
                <span className="font-bold text-gray-900">{metric.value}%</span>
              </div>
              <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 transition-all duration-500"
                  style={{ width: `${metric.value}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{metric.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-md border border-blue-100 text-center">
          <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-black text-gray-900">{insights.totalDays || 0}</p>
          <p className="text-xs text-gray-500">{translatedText.daysTracked}</p>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-md border border-blue-100 text-center">
          <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-black text-gray-900">{insights.completedDays || 0}</p>
          <p className="text-xs text-gray-500">{translatedText.perfectDays}</p>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-md border border-blue-100 text-center">
          <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-black text-gray-900">{healthScore.maxStreak}</p>
          <p className="text-xs text-gray-500">{translatedText.bestStreak}</p>
        </div>
      </div>

      {/* Time Pattern Analysis */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
        <h3 className="font-black text-gray-900 mb-4">{translatedText.timePerformance}</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-2xl ${timePatterns.betterTime === 'morning' ? 'bg-orange-50 border-2 border-orange-300' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Sun className={`w-5 h-5 ${timePatterns.betterTime === 'morning' ? 'text-orange-500' : 'text-gray-400'}`} />
              <span className="font-semibold text-gray-900">{translatedText.morning}</span>
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">{timePatterns.morningRate}%</p>
            {timePatterns.betterTime === 'morning' && (
              <p className="text-xs font-semibold text-orange-600">{translatedText.yourStrongestTime}</p>
            )}
          </div>
          
          <div className={`p-4 rounded-2xl ${timePatterns.betterTime === 'night' ? 'bg-indigo-50 border-2 border-indigo-300' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Moon className={`w-5 h-5 ${timePatterns.betterTime === 'night' ? 'text-indigo-500' : 'text-gray-400'}`} />
              <span className="font-semibold text-gray-900">{translatedText.night}</span>
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">{timePatterns.nightRate}%</p>
            {timePatterns.betterTime === 'night' && (
              <p className="text-xs font-semibold text-indigo-600">{translatedText.yourStrongestTime}</p>
            )}
          </div>
        </div>
      </div>

      {/* Predictive Insights */}
      {predictions.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 shadow-lg border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-purple-600" />
            <h3 className="font-black text-gray-900">{translatedText.aiPredictions}</h3>
          </div>
          
          <div className="space-y-3">
            {predictions.map((pred, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl">
                <div className="flex-shrink-0 mt-0.5">{pred.icon}</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm mb-1">{pred.title}</p>
                  <p className="text-sm text-gray-700">{pred.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparative Benchmarks */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
        <h3 className="font-black text-gray-900 mb-4">{translatedText.howYouCompare}</h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{translatedText.yourScore}</span>
              <span className="font-bold text-gray-900">{benchmarks.userScore}%</span>
            </div>
            <div className="relative h-8 bg-gray-100 rounded-xl overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className="flex-1 border-r border-white" style={{ background: 'linear-gradient(to right, #ef4444, #f97316)' }} />
                <div className="flex-1 border-r border-white" style={{ background: 'linear-gradient(to right, #f97316, #eab308)' }} />
                <div className="flex-1" style={{ background: 'linear-gradient(to right, #22c55e, #10b981)' }} />
              </div>
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                style={{ left: `${Math.min(benchmarks.userScore, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{translatedText.needsWork}</span>
              <span>{translatedText.good}</span>
              <span>{translatedText.excellent}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center p-3 rounded-xl bg-red-50">
              <p className="text-xs text-gray-600 mb-1">{translatedText.needsWork}</p>
              <p className="text-lg font-black text-red-600">{translatedText.needsWorkRange}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-yellow-50">
              <p className="text-xs text-gray-600 mb-1">{translatedText.good}</p>
              <p className="text-lg font-black text-yellow-600">{translatedText.goodRange}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-green-50">
              <p className="text-xs text-gray-600 mb-1">{translatedText.excellent}</p>
              <p className="text-lg font-black text-green-600">{translatedText.excellentRange}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Patterns */}
      {(insights.mostMissedTask || insights.mostMissedDay) && (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
          <h3 className="font-black text-gray-900 mb-4">{translatedText.detectedPatterns}</h3>
          <div className="space-y-3">
            {insights.mostMissedTask && (
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{translatedText.mostMissedTask}</p>
                  <p className="text-sm text-gray-700">
                    {(translatedText.mostMissedTaskDesc || translationKeys.mostMissedTaskDesc)
                      .replace('{task}', `<span class="capitalize font-bold">${insights.mostMissedTask}</span>`)}
                  </p>
                </div>
              </div>
            )}
            
            {insights.mostMissedDay && (
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl">
                <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{translatedText.challengingDay}</p>
                  <p className="text-sm text-gray-700">
                    {(translatedText.challengingDayDesc || translationKeys.challengingDayDesc)
                      .replace('{day}', `<span class="font-bold">${insights.mostMissedDay}</span>`)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {insights.confidence && !insights.confidence.patternsReliable && (
            <p className="mt-4 text-xs text-gray-500 text-center">
              {(translatedText.patternDetectionNote || translationKeys.patternDetectionNote)
                .replace('{days}', insights.confidence?.minDaysForPatterns || 14)}
            </p>
          )}
        </div>
      )}

      {/* Summary Insight */}
      {insights.summaryInsight && (
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900 text-sm mb-1">{translatedText.overview}</p>
              <p className="text-sm text-gray-700">{insights.summaryInsight}</p>
            </div>
          </div>
        </div>
      )}

      {/* Motivation */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 text-center">
        <Sparkles className="w-8 h-8 text-green-600 mx-auto mb-2" />
        <p className="text-sm text-gray-700 font-medium">
          {healthScore.total >= 80 ? (translatedText.motivationExcellent || translationKeys.motivationExcellent) :
           healthScore.total >= 60 ? (translatedText.motivationGood || translationKeys.motivationGood) :
           (translatedText.motivationNeedsWork || translationKeys.motivationNeedsWork)}
        </p>
      </div>
    </div>
  );
}
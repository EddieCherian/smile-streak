import { generateInsights } from "../utils/insights";
import { useState } from "react";
import { TrendingUp, TrendingDown, Target, Award, Calendar, Clock, Zap, Brain, Heart, AlertCircle, CheckCircle2, Flame, Trophy, BarChart3, Activity, Sun, Moon } from "lucide-react";

export default function Insights({ habitData }) {
  const insights = generateInsights(habitData);
  const [selectedMetric, setSelectedMetric] = useState(null);

  // Calculate health score (0-100)
  const calculateHealthScore = () => {
    const weights = {
      completionRate: 0.4,
      consistency: 0.3,
      balance: 0.2,
      improvement: 0.1
    };

    const completionScore = insights.completionRate;
    
    // Consistency: how many days in a row completed
    const dates = Object.keys(habitData).filter(k => !k.startsWith("__")).sort();
    let currentStreak = 0;
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
    
    currentStreak = tempStreak;
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
    
    const recentCompletion = recentDays.filter(d => {
      const day = habitData[d];
      return day?.morning && day?.night && day?.floss;
    }).length / recentDays.length * 100;
    
    const olderCompletion = olderDays.length > 0 ? olderDays.filter(d => {
      const day = habitData[d];
      return day?.morning && day?.night && day?.floss;
    }).length / olderDays.length * 100 : recentCompletion;
    
    const improvementScore = Math.min(Math.max(50 + (recentCompletion - olderCompletion), 0), 100);

    const totalScore = Math.round(
      completionScore * weights.completionRate +
      consistencyScore * weights.consistency +
      balanceScore * weights.balance +
      improvementScore * weights.improvement
    );

    return {
      total: totalScore,
      breakdown: {
        completion: Math.round(completionScore),
        consistency: Math.round(consistencyScore),
        balance: Math.round(balanceScore),
        improvement: Math.round(improvementScore)
      },
      streak: currentStreak,
      maxStreak
    };
  };

  const healthScore = calculateHealthScore();

  // Time-of-day analysis
  const getTimePatterns = () => {
    const dates = Object.keys(habitData).filter(k => !k.startsWith("__"));
    let morningSuccessful = 0;
    let nightSuccessful = 0;
    
    dates.forEach(date => {
      const d = habitData[date];
      if (d?.morning) morningSuccessful++;
      if (d?.night) nightSuccessful++;
    });

    return {
      morningRate: Math.round((morningSuccessful / dates.length) * 100),
      nightRate: Math.round((nightSuccessful / dates.length) * 100),
      betterTime: morningSuccessful > nightSuccessful ? 'morning' : 'night'
    };
  };

  const timePatterns = getTimePatterns();

  // Predictive insights
  const getPredictions = () => {
    const predictions = [];
    
    if (healthScore.streak >= 3) {
      predictions.push({
        type: 'success',
        icon: <Flame className="w-5 h-5 text-orange-500" />,
        title: 'Momentum Building',
        message: `You're on a ${healthScore.streak}-day streak! Keep this up for ${7 - healthScore.streak} more days to hit a week.`
      });
    }

    if (insights.mostMissedDay) {
      predictions.push({
        type: 'warning',
        icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
        title: 'Watch Out',
        message: `${insights.mostMissedDay}s are challenging for you. Set an extra reminder for this day.`
      });
    }

    if (timePatterns.morningRate < 60) {
      predictions.push({
        type: 'tip',
        icon: <Sun className="w-5 h-5 text-orange-400" />,
        title: 'Morning Opportunity',
        message: 'Morning brushing needs attention. Try placing your toothbrush next to your phone charger.'
      });
    }

    if (healthScore.total >= 80) {
      predictions.push({
        type: 'success',
        icon: <Trophy className="w-5 h-5 text-yellow-500" />,
        title: 'Excellence Achieved',
        message: 'Your dental care is in the top 20% of users. Your dentist will be impressed!'
      });
    }

    return predictions;
  };

  const predictions = getPredictions();

  // Comparative benchmarks
  const getBenchmarks = () => {
    return {
      excellent: 90,
      good: 70,
      needsWork: 50,
      userScore: insights.completionRate
    };
  };

  const benchmarks = getBenchmarks();

  // Get health score color and label
  const getScoreStatus = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'green', gradient: 'from-green-400 to-emerald-500' };
    if (score >= 75) return { label: 'Great', color: 'blue', gradient: 'from-blue-400 to-cyan-500' };
    if (score >= 60) return { label: 'Good', color: 'yellow', gradient: 'from-yellow-400 to-orange-400' };
    if (score >= 40) return { label: 'Fair', color: 'orange', gradient: 'from-orange-400 to-red-400' };
    return { label: 'Needs Work', color: 'red', gradient: 'from-red-400 to-pink-500' };
  };

  const scoreStatus = getScoreStatus(healthScore.total);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-6 h-6" />
            <h2 className="text-2xl font-black">Smart Insights</h2>
          </div>
          <p className="text-sm opacity-90">AI-powered analysis of your habits</p>
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
          
          <h3 className="text-2xl font-black mb-2">Health Score: {scoreStatus.label}</h3>
          <p className="text-sm opacity-90">
            {healthScore.total >= 80 ? 'Outstanding dental care routine!' :
             healthScore.total >= 60 ? 'Good habits, room to improve' :
             'Let\'s build better consistency together'}
          </p>

          {healthScore.streak > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Flame className="w-5 h-5" />
              <span className="font-bold">{healthScore.streak} Day Streak!</span>
            </div>
          )}
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
        <h3 className="font-black text-gray-900 mb-4">Score Breakdown</h3>
        
        <div className="space-y-4">
          {[
            { label: 'Completion Rate', value: healthScore.breakdown.completion, icon: <Target className="w-5 h-5 text-blue-500" />, desc: 'Tasks completed vs tracked' },
            { label: 'Consistency', value: healthScore.breakdown.consistency, icon: <Activity className="w-5 h-5 text-green-500" />, desc: 'Streak performance' },
            { label: 'Balance', value: healthScore.breakdown.balance, icon: <BarChart3 className="w-5 h-5 text-purple-500" />, desc: 'Even task distribution' },
            { label: 'Improvement', value: healthScore.breakdown.improvement, icon: <TrendingUp className="w-5 h-5 text-cyan-500" />, desc: 'Recent vs past performance' }
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
          <p className="text-2xl font-black text-gray-900">{insights.totalDays}</p>
          <p className="text-xs text-gray-500">Days Tracked</p>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-md border border-blue-100 text-center">
          <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-black text-gray-900">{insights.completedDays}</p>
          <p className="text-xs text-gray-500">Perfect Days</p>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-md border border-blue-100 text-center">
          <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-black text-gray-900">{healthScore.maxStreak}</p>
          <p className="text-xs text-gray-500">Best Streak</p>
        </div>
      </div>

      {/* Time Pattern Analysis */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
        <h3 className="font-black text-gray-900 mb-4">Time-of-Day Performance</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-2xl ${timePatterns.betterTime === 'morning' ? 'bg-orange-50 border-2 border-orange-300' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Sun className={`w-5 h-5 ${timePatterns.betterTime === 'morning' ? 'text-orange-500' : 'text-gray-400'}`} />
              <span className="font-semibold text-gray-900">Morning</span>
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">{timePatterns.morningRate}%</p>
            {timePatterns.betterTime === 'morning' && (
              <p className="text-xs font-semibold text-orange-600">Your strongest time!</p>
            )}
          </div>
          
          <div className={`p-4 rounded-2xl ${timePatterns.betterTime === 'night' ? 'bg-indigo-50 border-2 border-indigo-300' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Moon className={`w-5 h-5 ${timePatterns.betterTime === 'night' ? 'text-indigo-500' : 'text-gray-400'}`} />
              <span className="font-semibold text-gray-900">Night</span>
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">{timePatterns.nightRate}%</p>
            {timePatterns.betterTime === 'night' && (
              <p className="text-xs font-semibold text-indigo-600">Your strongest time!</p>
            )}
          </div>
        </div>
      </div>

      {/* Predictive Insights */}
      {predictions.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 shadow-lg border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-purple-600" />
            <h3 className="font-black text-gray-900">AI Predictions & Tips</h3>
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
        <h3 className="font-black text-gray-900 mb-4">How You Compare</h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Your Score</span>
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
                style={{ left: `${benchmarks.userScore}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Needs Work</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center p-3 rounded-xl bg-red-50">
              <p className="text-xs text-gray-600 mb-1">Needs Work</p>
              <p className="text-lg font-black text-red-600">&lt;50%</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-yellow-50">
              <p className="text-xs text-gray-600 mb-1">Good</p>
              <p className="text-lg font-black text-yellow-600">50-80%</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-green-50">
              <p className="text-xs text-gray-600 mb-1">Excellent</p>
              <p className="text-lg font-black text-green-600">80%+</p>
            </div>
          </div>
        </div>
      </div>

      {/* Patterns */}
      {(insights.mostMissedTask || insights.mostMissedDay) && (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
          <h3 className="font-black text-gray-900 mb-4">Detected Patterns</h3>
          <div className="space-y-3">
            {insights.mostMissedTask && (
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Most Missed Task</p>
                  <p className="text-sm text-gray-700">
                    <span className="capitalize font-bold">{insights.mostMissedTask}</span> is your most commonly skipped task
                  </p>
                </div>
              </div>
            )}
            
            {insights.mostMissedDay && (
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl">
                <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Challenging Day</p>
                  <p className="text-sm text-gray-700">
                    <span className="font-bold">{insights.mostMissedDay}s</span> are when you're most likely to miss tasks
                  </p>
                </div>
              </div>
            )}
          </div>

          {insights.confidence && !insights.confidence.patternsReliable && (
            <p className="mt-4 text-xs text-gray-500 text-center">
              Pattern detection improves after {insights.confidence.minDaysForPatterns} days of tracking
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
              <p className="font-bold text-gray-900 text-sm mb-1">Overview</p>
              <p className="text-sm text-gray-700">{insights.summaryInsight}</p>
            </div>
          </div>
        </div>
      )}

      {/* Motivation */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 text-center">
        <Sparkles className="w-8 h-8 text-green-600 mx-auto mb-2" />
        <p className="text-sm text-gray-700 font-medium">
          {healthScore.total >= 80 ? 'You\'re crushing it! Keep up this amazing routine.' :
           healthScore.total >= 60 ? 'You\'re building great habits. Small improvements add up!' :
           'Every day is a new opportunity. You\'ve got this! 💪'}
        </p>
      </div>
    </div>
  );
}

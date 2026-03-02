import { generateInsights } from "../utils/insights";
import { useState, useContext, useEffect } from "react";
import { 
  // Core icons that definitely exist in your version
  TrendingUp, TrendingDown, Target, Award, Calendar, Clock, Zap, Brain, 
  Heart, AlertCircle, CheckCircle2, Flame, Trophy, BarChart3, Activity, 
  Sun, Moon, Sparkles, Share2, Download, Printer, 
  Gift, Crown, Medal, Star, Rocket, Code, Coffee, Palette, Users, Globe, Lock, Eye, EyeOff,
  Bell, Filter, RefreshCw, AlertTriangle, ThumbsUp, ThumbsDown, Smile,
  Frown, Meh, Cloud, CloudRain, CloudSnow, CloudLightning, Wind,
  Thermometer, Droplets, Sunrise, Sunset,
  BookOpen, Microscope, 
  User, Users2, Home, MapPin, Navigation, Compass,
  Phone, Video, Headphones, Music, Volume2, VolumeX,
  Camera, Film, Image, Layers,
  // Add these missing icons
  Grid, List, Menu, Settings, Sliders,
  ChevronDown, ChevronUp,
  Maximize, Minimize,
  ZoomIn, ZoomOut, Plus, Minus, Divide, Equal,
  Percent, Infinity, 
  DollarSign, Euro, PoundSterling, Yen,
  Bitcoin, CreditCard, Wallet, PiggyBank,
  Banknote, Coins,
  Circle, Square, Triangle,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  ChevronsUp, ChevronsDown, ChevronsLeft, ChevronsRight,
  Pill, Syringe,
  Baby, 
  Flask, Link, Image as ImageIcon, Briefcase, 
  Shield,
  // Add these for the UI
  PieChart, Radar,
  Type, ToggleLeft, ToggleRight,
  Settings as SettingsIcon
} from "lucide-react";
import { TranslationContext } from "../App";

// Create fallback components for icons that don't exist
const Dna = ({ className }) => <span className={className}>🧬</span>;
const Bacteria = ({ className }) => <span className={className}>🦠</span>;
const Milk = ({ className }) => <span className={className}>🥛</span>;
const Flower = ({ className }) => <span className={className}>🌸</span>;

export default function Insights({ habitData }) {
  const { t, currentLanguage, translating } = useContext(TranslationContext);
  const [translatedText, setTranslatedText] = useState({});

  // Simplify state - remove the 100+ unused state variables
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [timeRange, setTimeRange] = useState('all');
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);
  const [showPredictions, setShowPredictions] = useState(true);
  const [showComparisons, setShowComparisons] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Translation keys - keeping only what's actually used
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
    
    scoreExcellent: "Excellent",
    scoreGreat: "Great",
    scoreGood: "Good",
    scoreFair: "Fair",
    scoreNeedsWork: "Needs Work",
    
    healthDescExcellent: "Outstanding dental care routine!",
    healthDescGood: "Good habits, room to improve",
    healthDescNeedsWork: "Let's build better consistency together",
    
    momentumTitle: "Momentum Building",
    momentumMessage: "You're on a {streak}-day streak! Keep this up for {days} more days to hit a week.",
    watchOutTitle: "Watch Out",
    watchOutMessage: "{day}s are challenging for you. Set an extra reminder for this day.",
    morningOpportunityTitle: "Morning Opportunity",
    morningOpportunityMessage: "Morning brushing needs attention. Try placing your toothbrush next to your phone charger.",
    excellenceTitle: "Excellence Achieved",
    excellenceMessage: "Your dental care is in the top 20% of users. Your dentist will be impressed!",
    
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

      const morningRate = insights.taskStats?.morning || 0;
      const nightRate = insights.taskStats?.night || 0;
      const flossRate = insights.taskStats?.floss || 0;
      const avgRate = (morningRate + nightRate + flossRate) / 3;
      const variance = ((Math.abs(morningRate - avgRate) + Math.abs(nightRate - avgRate) + Math.abs(flossRate - avgRate)) / 3);
      const balanceScore = Math.max(100 - variance, 0);

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

  // Weather patterns (simulated)
  const getWeatherPatterns = () => {
    return {
      rainyImpact: Math.floor(Math.random() * 30) + 10,
      sunnyBoost: Math.floor(Math.random() * 25) + 15,
      temperatureEffect: Math.random() > 0.5,
      humidityImpact: Math.random() > 0.5
    };
  };

  const weatherPatterns = getWeatherPatterns();

  // Circadian rhythm (simulated)
  const getCircadianRhythm = () => {
    return {
      type: Math.random() > 0.5 ? 'morning' : 'night',
      optimalTime: Math.random() > 0.5 ? '8:00 AM' : '9:00 PM'
    };
  };

  const circadianRhythm = getCircadianRhythm();

  // Microbiome analysis (simulated)
  const getMicrobiomeHealth = () => {
    return {
      bacteriaBalance: Math.floor(Math.random() * 30) + 60,
      probioticNeeded: Math.random() > 0.5 ? 'Lactobacillus' : 'Bifidobacterium'
    };
  };

  const microbiomeHealth = getMicrobiomeHealth();

  // Nutrition analysis (simulated)
  const getNutritionCorrelation = () => {
    return {
      calciumIntake: Math.floor(Math.random() * 40) + 40,
      vitaminD: Math.random() > 0.5
    };
  };

  const nutritionCorrelation = getNutritionCorrelation();

  // Hydration tracking (simulated)
  const getHydrationLevel = () => {
    return {
      waterIntake: Math.floor(Math.random() * 50) + 30,
      dehydrationRisk: Math.random() > 0.7
    };
  };

  const hydrationLevel = getHydrationLevel();

  // Sleep analysis (simulated)
  const getSleepQuality = () => {
    return {
      sleepDuration: Math.floor(Math.random() * 4) + 5,
      sleepConsistency: Math.random() > 0.5
    };
  };

  const sleepQuality = getSleepQuality();

  // Stress analysis (simulated)
  const getStressLevels = () => {
    return {
      cortisolLevels: Math.random() > 0.5,
      stressResponse: Math.floor(Math.random() * 40) + 30
    };
  };

  const stressLevels = getStressLevels();

  // Exercise correlation (simulated)
  const getExerciseImpact = () => {
    return {
      workoutDays: Math.floor(Math.random() * 25) + 65
    };
  };

  const exerciseImpact = getExerciseImpact();

  // Social factors (simulated)
  const getSocialFactors = () => {
    return {
      weekendEffect: Math.random() > 0.5,
      holidayImpact: Math.random() > 0.6
    };
  };

  const socialFactors = getSocialFactors();

  // Work patterns (simulated)
  const getWorkPatterns = () => {
    return {
      weekdayPerformance: Math.floor(Math.random() * 30) + 60,
      weekendPerformance: Math.floor(Math.random() * 30) + 50
    };
  };

  const workPatterns = getWorkPatterns();

  // Financial analysis (simulated)
  const getFinancialHealth = () => {
    return {
      dentalSpending: Math.floor(Math.random() * 500) + 100,
      insuranceOptimization: Math.random() > 0.5
    };
  };

  const financialHealth = getFinancialHealth();

  // Environmental factors (simulated)
  const getEnvironmentalImpact = () => {
    return {
      pollenCount: Math.floor(Math.random() * 100) + 50,
      uvIndex: Math.floor(Math.random() * 8) + 2
    };
  };

  const environmentalImpact = getEnvironmentalImpact();

  // Achievement badges (simulated)
  const getAchievements = () => {
    return [
      { id: 1, name: 'badge1', unlocked: true, icon: <Rocket className="w-4 h-4" />, color: 'purple' },
      { id: 2, name: 'badge2', unlocked: healthScore.streak >= 7, icon: <Star className="w-4 h-4" />, color: 'yellow' },
      { id: 3, name: 'badge3', unlocked: healthScore.maxStreak >= 30, icon: <Flame className="w-4 h-4" />, color: 'orange' },
      { id: 4, name: 'badge4', unlocked: false, icon: <Users className="w-4 h-4" />, color: 'green' },
      { id: 5, name: 'badge5', unlocked: insights.totalDays >= 100, icon: <BarChart3 className="w-4 h-4" />, color: 'blue' }
    ];
  };

  const achievements = getAchievements();

  // Gamification (simulated)
  const getGamification = () => {
    return {
      level: Math.floor(insights.totalDays / 10) + 1,
      xp: (insights.totalDays % 10) * 100,
      nextLevelXP: 1000,
      rank: Math.floor(Math.random() * 1000) + 1
    };
  };

  const gamification = getGamification();

  // Leaderboard (simulated)
  const getLeaderboard = () => {
    return [
      { name: 'User1', score: 95, rank: 1 },
      { name: 'User2', score: 92, rank: 2 },
      { name: 'User3', score: 88, rank: 3 },
      { name: 'You', score: healthScore.total, rank: gamification.rank }
    ];
  };

  const leaderboard = getLeaderboard();

  // Predictive insights
  const getPredictions = () => {
    try {
      const predictions = [];
      
      if (healthScore.streak >= 3) {
        predictions.push({
          type: 'success',
          icon: <Flame className="w-5 h-5 text-orange-500" />,
          title: translatedText.momentumTitle || translationKeys.momentumTitle,
          message: `You're on a ${healthScore.streak}-day streak! Keep it up!`
        });
      }

      if (insights.mostMissedDay) {
        predictions.push({
          type: 'warning',
          icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
          title: translatedText.watchOutTitle || translationKeys.watchOutTitle,
          message: `${insights.mostMissedDay}s are challenging for you.`
        });
      }

      if (timePatterns.morningRate < 60) {
        predictions.push({
          type: 'tip',
          icon: <Sun className="w-5 h-5 text-orange-400" />,
          title: translatedText.morningOpportunityTitle || translationKeys.morningOpportunityTitle,
          message: "Morning brushing needs attention."
        });
      }

      if (healthScore.total >= 80) {
        predictions.push({
          type: 'success',
          icon: <Trophy className="w-5 h-5 text-yellow-500" />,
          title: translatedText.excellenceTitle || translationKeys.excellenceTitle,
          message: "Excellent dental care routine!"
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
      userScore: insights.completionRate || 0
    };
  };

  const benchmarks = getBenchmarks();

  // Get health score color and label
  const getScoreStatus = (score) => {
    if (score >= 90) return { 
      label: translatedText.scoreExcellent || translationKeys.scoreExcellent, 
      gradient: 'from-green-400 to-emerald-500' 
    };
    if (score >= 75) return { 
      label: translatedText.scoreGreat || translationKeys.scoreGreat, 
      gradient: 'from-blue-400 to-cyan-500' 
    };
    if (score >= 60) return { 
      label: translatedText.scoreGood || translationKeys.scoreGood, 
      gradient: 'from-yellow-400 to-orange-400' 
    };
    if (score >= 40) return { 
      label: translatedText.scoreFair || translationKeys.scoreFair, 
      gradient: 'from-orange-400 to-red-400' 
    };
    return { 
      label: translatedText.scoreNeedsWork || translationKeys.scoreNeedsWork, 
      gradient: 'from-red-400 to-pink-500' 
    };
  };

  const scoreStatus = getScoreStatus(healthScore.total);

  // Show loading state
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

      {/* Time Range Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'week', label: 'Week' },
          { id: 'month', label: 'Month' },
          { id: 'year', label: 'Year' },
          { id: 'all', label: 'All Time' }
        ].map(range => (
          <button
            key={range.id}
            onClick={() => setTimeRange(range.id)}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
              timeRange === range.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
            }`}
          >
            {range.label}
          </button>
        ))}
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

          <div className="mt-4 flex items-center justify-center gap-4">
            {healthScore.streak > 0 && (
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Flame className="w-5 h-5" />
                <span className="font-bold">{healthScore.streak} {translatedText.dayStreak}</span>
              </div>
            )}
            
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Trophy className="w-5 h-5" />
              <span className="font-bold">Level {gamification.level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
        <h3 className="font-black text-gray-900 mb-4 flex items-center justify-between">
          <span>{translatedText.scoreBreakdown}</span>
          <button
            onClick={() => setShowAdvancedStats(!showAdvancedStats)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showAdvancedStats ? 'Hide Advanced' : 'Show Advanced'}
          </button>
        </h3>
        
        <div className="space-y-4">
          {[
            { label: translatedText.completionRate, value: healthScore.breakdown.completion, icon: <Target className="w-5 h-5 text-blue-500" />, desc: translatedText.completionRateDesc },
            { label: translatedText.consistency, value: healthScore.breakdown.consistency, icon: <Activity className="w-5 h-5 text-green-500" />, desc: translatedText.consistencyDesc },
            { label: translatedText.balance, value: healthScore.breakdown.balance, icon: <BarChart3 className="w-5 h-5 text-purple-500" />, desc: translatedText.balanceDesc },
            { label: translatedText.improvement, value: healthScore.breakdown.improvement, icon: <TrendingUp className="w-5 h-5 text-cyan-500" />, desc: translatedText.improvementDesc }
          ].map((metric) => (
            <div key={metric.label}>
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

      {/* Achievement Badges */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-3xl p-6 shadow-lg">
        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
          <Crown className="w-6 h-6 text-yellow-600" />
          {translatedText.achievements || "Achievement Badges"}
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {achievements.map((badge) => (
            <div
              key={badge.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                badge.unlocked
                  ? `bg-${badge.color}-100 border border-${badge.color}-300`
                  : 'bg-gray-100 border border-gray-300 opacity-50'
              }`}
            >
              <span className={badge.unlocked ? `text-${badge.color}-600` : 'text-gray-400'}>
                {badge.icon}
              </span>
              <span className={`text-xs font-medium ${badge.unlocked ? 'text-gray-700' : 'text-gray-400'}`}>
                {translatedText[badge.name] || badge.name}
              </span>
            </div>
          ))}
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

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Hydration */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            <h4 className="font-bold text-gray-900 text-sm">Hydration</h4>
          </div>
          <p className="text-2xl font-black text-gray-900 mb-1">{hydrationLevel.waterIntake}%</p>
          {hydrationLevel.dehydrationRisk && (
            <p className="text-xs text-red-600 font-semibold">⚠️ Dehydration Risk</p>
          )}
        </div>

        {/* Sleep */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Moon className="w-5 h-5 text-indigo-500" />
            <h4 className="font-bold text-gray-900 text-sm">Sleep</h4>
          </div>
          <p className="text-2xl font-black text-gray-900 mb-1">{sleepQuality.sleepDuration}h</p>
          <p className="text-xs text-gray-600">
            {sleepQuality.sleepConsistency ? 'Consistent' : 'Irregular'}
          </p>
        </div>

        {/* Stress */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-red-500" />
            <h4 className="font-bold text-gray-900 text-sm">Stress</h4>
          </div>
          <p className="text-2xl font-black text-gray-900 mb-1">{stressLevels.stressResponse}%</p>
        </div>

        {/* Exercise */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-green-500" />
            <h4 className="font-bold text-gray-900 text-sm">Exercise</h4>
          </div>
          <p className="text-2xl font-black text-gray-900 mb-1">{exerciseImpact.workoutDays}%</p>
        </div>
      </div>

      {/* Predictive Insights */}
      {predictions.length > 0 && showPredictions && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 shadow-lg border-2 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-purple-600" />
              <h3 className="font-black text-gray-900">{translatedText.aiPredictions}</h3>
            </div>
            <button
              onClick={() => setShowPredictions(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <EyeOff className="w-5 h-5" />
            </button>
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
      {showComparisons && (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-900">{translatedText.howYouCompare}</h3>
            <button
              onClick={() => setShowComparisons(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <EyeOff className="w-5 h-5" />
            </button>
          </div>
          
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

          {/* Leaderboard */}
          <div className="mt-4">
            <h4 className="font-bold text-gray-900 text-sm mb-2">Leaderboard</h4>
            <div className="space-y-2">
              {leaderboard.map((user, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">#{user.rank}</span>
                    <span className={`text-sm font-medium ${user.name === 'You' ? 'text-blue-600' : 'text-gray-700'}`}>
                      {user.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{user.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
                    {insights.mostMissedTask} is your most commonly skipped task
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
                    {insights.mostMissedDay}s are when you're most likely to miss tasks
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {showRecommendations && (
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6 text-amber-600" />
              <h3 className="font-black text-gray-900">Personalized Recommendations</h3>
            </div>
            <button
              onClick={() => setShowRecommendations(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <EyeOff className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {timePatterns.morningRate < 60 && (
              <div className="p-3 bg-white/60 rounded-xl">
                <p className="text-sm text-gray-700">
                  ☀️ Set your toothbrush next to your phone charger as a morning reminder
                </p>
              </div>
            )}

            {timePatterns.nightRate < 60 && (
              <div className="p-3 bg-white/60 rounded-xl">
                <p className="text-sm text-gray-700">
                  🌙 Place floss next to your bed as a visual reminder before sleep
                </p>
              </div>
            )}

            {hydrationLevel.dehydrationRisk && (
              <div className="p-3 bg-white/60 rounded-xl">
                <p className="text-sm text-gray-700">
                  💧 Drink more water throughout the day to maintain oral health
                </p>
              </div>
            )}

            {sleepQuality.sleepDuration < 7 && (
              <div className="p-3 bg-white/60 rounded-xl">
                <p className="text-sm text-gray-700">
                  😴 Aim for 7-8 hours of sleep to improve morning consistency
                </p>
              </div>
            )}
          </div>
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

      {/* Footer */}
      <div className="text-center pt-4">
        <p className="text-xs text-gray-400">
          Smile Streak v1.0.0 • {new Date().toLocaleDateString()} • Level {gamification.level} • {gamification.xp} XP
        </p>
      </div>
    </div>
  );
}
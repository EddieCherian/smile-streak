import { useState } from "react";
import { Download, Mail, TrendingUp, TrendingDown, Award, Calendar, Target, Zap, FileText, Share2, Printer, CheckCircle2, AlertCircle, BarChart3 } from "lucide-react";

export default function Report({ habitData }) {
  const [timeframe, setTimeframe] = useState("all"); // 'all', '30days', '7days'
  const [exportFormat, setExportFormat] = useState("txt"); // 'txt', 'pdf', 'email'
  const [showShareModal, setShowShareModal] = useState(false);

  // Filter data by timeframe
  const getFilteredDates = () => {
    const dates = Object.keys(habitData).filter((k) => !k.startsWith("__"));
    
    if (timeframe === "all") return dates;
    
    const now = new Date();
    const cutoff = new Date();
    
    if (timeframe === "7days") {
      cutoff.setDate(now.getDate() - 7);
    } else if (timeframe === "30days") {
      cutoff.setDate(now.getDate() - 30);
    }
    
    return dates.filter(date => new Date(date) >= cutoff);
  };

  const dates = getFilteredDates();
  let totalDays = dates.length;
  let morningCount = 0;
  let nightCount = 0;
  let flossCount = 0;
  let perfectDays = 0;
  let partialDays = 0;
  let skippedDays = 0;

  // Weekly breakdown
  const weeklyData = {};
  const monthlyData = {};

  dates.forEach((date) => {
    const d = habitData[date];
    if (!d) return;

    const completedTasks = [d.morning, d.night, d.floss].filter(Boolean).length;

    if (d.morning) morningCount++;
    if (d.night) nightCount++;
    if (d.floss) flossCount++;

    if (completedTasks === 3) perfectDays++;
    else if (completedTasks > 0) partialDays++;
    else skippedDays++;

    // Weekly tracking
    const weekKey = getWeekKey(new Date(date));
    if (!weeklyData[weekKey]) weeklyData[weekKey] = { perfect: 0, partial: 0, skipped: 0 };
    if (completedTasks === 3) weeklyData[weekKey].perfect++;
    else if (completedTasks > 0) weeklyData[weekKey].partial++;
    else weeklyData[weekKey].skipped++;

    // Monthly tracking
    const monthKey = new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!monthlyData[monthKey]) monthlyData[monthKey] = 0;
    if (completedTasks === 3) monthlyData[monthKey]++;
  });

  function getWeekKey(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
    const weekNum = Math.ceil((days + 1) / 7);
    return `Week ${weekNum}`;
  }

  const percent = (n) => totalDays ? Math.round((n / totalDays) * 100) : 0;

  // Calculate trends (compare to previous period)
  const getPreviousPeriodComparison = () => {
    if (timeframe === "all") return null;
    
    const now = new Date();
    const currentPeriodStart = new Date();
    const previousPeriodStart = new Date();
    const previousPeriodEnd = new Date();
    
    if (timeframe === "7days") {
      currentPeriodStart.setDate(now.getDate() - 7);
      previousPeriodStart.setDate(now.getDate() - 14);
      previousPeriodEnd.setDate(now.getDate() - 7);
    } else {
      currentPeriodStart.setDate(now.getDate() - 30);
      previousPeriodStart.setDate(now.getDate() - 60);
      previousPeriodEnd.setDate(now.getDate() - 30);
    }

    const allDates = Object.keys(habitData).filter((k) => !k.startsWith("__"));
    const previousDates = allDates.filter(date => {
      const d = new Date(date);
      return d >= previousPeriodStart && d < previousPeriodEnd;
    });

    let prevPerfect = 0;
    previousDates.forEach(date => {
      const d = habitData[date];
      if (d?.morning && d?.night && d?.floss) prevPerfect++;
    });

    const prevPercent = previousDates.length ? Math.round((prevPerfect / previousDates.length) * 100) : 0;
    const currentPercent = percent(perfectDays);
    const change = currentPercent - prevPercent;

    return { change, improving: change > 0 };
  };

  const trend = getPreviousPeriodComparison();

  // Generate insights
  const getInsights = () => {
    const insights = [];

    if (percent(perfectDays) >= 80) {
      insights.push({ type: "success", text: "Excellent consistency! You're maintaining a strong routine.", icon: <Award className="w-5 h-5 text-yellow-500" /> });
    } else if (percent(perfectDays) >= 50) {
      insights.push({ type: "info", text: "Good progress! Try to complete all three tasks daily for best results.", icon: <TrendingUp className="w-5 h-5 text-blue-500" /> });
    } else {
      insights.push({ type: "warning", text: "Room for improvement. Set reminders to build consistency.", icon: <AlertCircle className="w-5 h-5 text-orange-500" /> });
    }

    if (percent(morningCount) < 50) {
      insights.push({ type: "tip", text: "Morning brushing needs attention. Consider setting an alarm.", icon: <Target className="w-5 h-5 text-purple-500" /> });
    }

    if (percent(flossCount) < percent(morningCount)) {
      insights.push({ type: "tip", text: "Flossing frequency is lower than brushing. Aim to match your brushing consistency.", icon: <Zap className="w-5 h-5 text-cyan-500" /> });
    }

    if (trend && trend.improving) {
      insights.push({ type: "success", text: `You've improved by ${trend.change}% compared to the previous period!`, icon: <TrendingUp className="w-5 h-5 text-green-500" /> });
    }

    return insights;
  };

  const insights = getInsights();

  // Export functions
  const reportText = `
SMILE STREAK DENTAL REPORT
${timeframe === "7days" ? "Last 7 Days" : timeframe === "30days" ? "Last 30 Days" : "All Time"}
Generated: ${new Date().toLocaleDateString()}

═══════════════════════════════════════

SUMMARY
Tracked Days: ${totalDays}
Perfect Days: ${perfectDays} (${percent(perfectDays)}%)
Partial Completion: ${partialDays} (${percent(partialDays)}%)
Skipped Days: ${skippedDays} (${percent(skippedDays)}%)

TASK BREAKDOWN
Morning Brushing: ${morningCount}/${totalDays} (${percent(morningCount)}%)
Night Brushing: ${nightCount}/${totalDays} (${percent(nightCount)}%)
Interdental Cleaning: ${flossCount}/${totalDays} (${percent(flossCount)}%)

${trend ? `TREND ANALYSIS
Change from previous period: ${trend.change > 0 ? '+' : ''}${trend.change}%
Status: ${trend.improving ? 'Improving ↑' : 'Declining ↓'}
` : ''}

KEY INSIGHTS
${insights.map(i => `• ${i.text}`).join('\n')}

═══════════════════════════════════════
This report was generated by Smile Streak
Share with your dentist for personalized advice
  `;

  const downloadTxtReport = () => {
    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `smile-streak-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent("My Smile Streak Dental Report");
    const body = encodeURIComponent(reportText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-6 h-6" />
            <h2 className="text-2xl font-black">Dental Report</h2>
          </div>
          <p className="text-sm opacity-90">Comprehensive analysis of your dental care habits</p>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All Time' },
          { id: '30days', label: 'Last 30 Days' },
          { id: '7days', label: 'Last 7 Days' }
        ].map(tf => (
          <button
            key={tf.id}
            onClick={() => setTimeframe(tf.id)}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
              timeframe === tf.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <p className="text-xs text-gray-500">Total Days</p>
          </div>
          <p className="text-3xl font-black text-gray-900">{totalDays}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 shadow-lg border-2 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-xs text-gray-600">Perfect Days</p>
          </div>
          <p className="text-3xl font-black text-green-700">{percent(perfectDays)}%</p>
          {trend && (
            <p className={`text-xs font-semibold mt-1 flex items-center gap-1 ${
              trend.improving ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.improving ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend.change > 0 ? '+' : ''}{trend.change}% vs previous
            </p>
          )}
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
        <h3 className="font-black text-gray-900 mb-4">Task Breakdown</h3>
        
        <div className="space-y-4">
          {[
            { label: "Morning Brushing", count: morningCount, icon: "☀️", color: "orange" },
            { label: "Night Brushing", count: nightCount, icon: "🌙", color: "indigo" },
            { label: "Interdental Care", count: flossCount, icon: "🧵", color: "cyan" }
          ].map((task) => {
            const taskPercent = percent(task.count);
            return (
              <div key={task.label}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{task.icon}</span>
                    <span className="font-semibold text-gray-900">{task.label}</span>
                  </div>
                  <span className="font-bold text-gray-900">{taskPercent}%</span>
                </div>
                <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-${task.color}-400 to-${task.color}-500 transition-all duration-500`}
                    style={{ width: `${taskPercent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{task.count} out of {totalDays} days</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion Distribution */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
        <h3 className="font-black text-gray-900 mb-4">Completion Distribution</h3>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-4 rounded-2xl bg-green-50 border border-green-200">
            <p className="text-3xl font-black text-green-600">{perfectDays}</p>
            <p className="text-xs text-gray-600 mt-1">Perfect Days</p>
            <p className="text-xs font-semibold text-green-600">{percent(perfectDays)}%</p>
          </div>
          
          <div className="text-center p-4 rounded-2xl bg-yellow-50 border border-yellow-200">
            <p className="text-3xl font-black text-yellow-600">{partialDays}</p>
            <p className="text-xs text-gray-600 mt-1">Partial Days</p>
            <p className="text-xs font-semibold text-yellow-600">{percent(partialDays)}%</p>
          </div>
          
          <div className="text-center p-4 rounded-2xl bg-red-50 border border-red-200">
            <p className="text-3xl font-black text-red-600">{skippedDays}</p>
            <p className="text-xs text-gray-600 mt-1">Skipped Days</p>
            <p className="text-xs font-semibold text-red-600">{percent(skippedDays)}%</p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 shadow-lg border-2 border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-6 h-6 text-purple-600" />
          <h3 className="font-black text-gray-900">Personalized Insights</h3>
        </div>
        
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl">
              <div className="flex-shrink-0 mt-0.5">{insight.icon}</div>
              <p className="text-sm text-gray-700">{insight.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Trend (if available) */}
      {Object.keys(weeklyData).length > 1 && (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
          <h3 className="font-black text-gray-900 mb-4">Weekly Trend</h3>
          <div className="space-y-2">
            {Object.entries(weeklyData).slice(-4).map(([week, data]) => (
              <div key={week}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-gray-700">{week}</span>
                  <span className="text-gray-600">{data.perfect} perfect days</span>
                </div>
                <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
                  <div className="bg-green-500" style={{ width: `${(data.perfect / 7) * 100}%` }} />
                  <div className="bg-yellow-400" style={{ width: `${(data.partial / 7) * 100}%` }} />
                  <div className="bg-red-400" style={{ width: `${(data.skipped / 7) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
        <h3 className="font-black text-gray-900 mb-4">Share Your Report</h3>
        
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={downloadTxtReport}
            className="flex items-center justify-between p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">Download Report</p>
                <p className="text-xs text-gray-600">Save as text file for your dentist</p>
              </div>
            </div>
            <FileText className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={shareViaEmail}
            className="flex items-center justify-between p-4 rounded-2xl bg-green-50 border-2 border-green-200 hover:bg-green-100 hover:border-green-300 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">Email Report</p>
                <p className="text-xs text-gray-600">Send directly to your dentist</p>
              </div>
            </div>
            <Share2 className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={printReport}
            className="flex items-center justify-between p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 hover:bg-purple-100 hover:border-purple-300 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Printer className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">Print Report</p>
                <p className="text-xs text-gray-600">Physical copy for appointments</p>
              </div>
            </div>
            <Printer className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Dentist Recommendation */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-gray-900 text-sm mb-1">Share with Your Dentist</p>
            <p className="text-xs text-gray-600">
              This report provides valuable insights for your next dental appointment. Your dentist can use this data to give you personalized recommendations!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

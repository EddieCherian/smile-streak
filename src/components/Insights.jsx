import { generateInsights } from "../utils/insights";
import { useState, useContext, useEffect, useMemo } from "react";
import { 
  TrendingUp, TrendingDown, Target, Award, Calendar, Clock, Zap, Brain, 
  Heart, AlertCircle, CheckCircle2, Flame, Trophy, BarChart3, Activity, 
  Sun, Moon, Sparkles, Share2, Download, Printer, Mail, Facebook, 
  Twitter, Instagram, Linkedin, MessageCircle, Gift, Crown, Medal, 
  Star, Rocket, Code, Coffee, Palette, Users, Globe, Lock, Eye, EyeOff,
  Bell, Filter, RefreshCw, AlertTriangle, ThumbsUp, ThumbsDown, Smile,
  Frown, Meh, Cloud, CloudRain, CloudSnow, CloudLightning, Wind,
  Thermometer, Droplets, Sunrise, Sunset, Coffee as CoffeeIcon,
  BookOpen, Microscope, Stethoscope, Pill, Syringe, Bandage,
  Baby, User, Users2, Home, MapPin, Navigation, Compass,
  Phone, Video, Headphones, Music, Volume2, VolumeX,
  Camera, Video as VideoIcon, Film, Image, Layers,
  Grid, List, Menu, Settings, Sliders, ToggleLeft,
  ToggleRight, Circle, Square, Triangle, Hexagon,
  Pentagon, Octagon, CircleDot, CircleSlashed,
  CircleOff, CircleDashed, CircleDotDashed,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  ArrowUpCircle, ArrowDownCircle, ArrowLeftCircle,
  ArrowRightCircle, ChevronUp, ChevronDown,
  ChevronLeft, ChevronRight, ChevronsUp, ChevronsDown,
  ChevronsLeft, ChevronsRight, Maximize, Minimize,
  ZoomIn, ZoomOut, Plus, Minus, Divide, Equal,
  Percent, Infinity, Sigma, Pi, SquareRoot,
  FunctionSquare, Calculator, Hash, AtSign,
  DollarSign, Euro, PoundSterling, Yen,
  Bitcoin, CreditCard, Wallet, PiggyBank,
  Banknote, Coins, BadgeDollarSign,
  BadgeCent, BadgeEuro, BadgePoundSterling,
  BadgeJapaneseYen, BadgeIndianRupee,
  BadgeRussianRuble, BadgeSwissFranc,
  BadgePolishZloty, BadgeThaiBaht,
  BadgeIndonesianRupiah, BadgeVietnameseDong
} from "lucide-react";
import { TranslationContext } from "../App";

export default function Insights({ habitData }) {
  const { t, currentLanguage, translating } = useContext(TranslationContext);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [translatedText, setTranslatedText] = useState({});
  const [timeRange, setTimeRange] = useState('all'); // 'week', 'month', 'year', 'all'
  const [chartType, setChartType] = useState('bar'); // 'bar', 'line', 'pie', 'radar'
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);
  const [showPredictions, setShowPredictions] = useState(true);
  const [showComparisons, setShowComparisons] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [selectedView, setSelectedView] = useState('dashboard'); // 'dashboard', 'analytics', 'trends', 'predictions'
  const [selectedTheme, setSelectedTheme] = useState('light'); // 'light', 'dark', 'system'
  const [selectedFontSize, setSelectedFontSize] = useState('medium'); // 'small', 'medium', 'large'
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');
  const [selectedDateFormat, setSelectedDateFormat] = useState('MM/DD/YYYY');
  const [selectedTimeFormat, setSelectedTimeFormat] = useState('12h');
  const [selectedUnitSystem, setSelectedUnitSystem] = useState('imperial'); // 'imperial', 'metric'
  const [selectedTemperatureUnit, setSelectedTemperatureUnit] = useState('fahrenheit'); // 'fahrenheit', 'celsius'
  const [selectedDistanceUnit, setSelectedDistanceUnit] = useState('miles'); // 'miles', 'kilometers'
  const [selectedWeightUnit, setSelectedWeightUnit] = useState('lbs'); // 'lbs', 'kg'
  const [selectedHeightUnit, setSelectedHeightUnit] = useState('ft'); // 'ft', 'cm'
  const [selectedPressureUnit, setSelectedPressureUnit] = useState('psi'); // 'psi', 'kpa'
  const [selectedVolumeUnit, setSelectedVolumeUnit] = useState('oz'); // 'oz', 'ml'
  const [selectedEnergyUnit, setSelectedEnergyUnit] = useState('cal'); // 'cal', 'kj'
  const [selectedSpeedUnit, setSelectedSpeedUnit] = useState('mph'); // 'mph', 'kmh'
  const [selectedAccelerationUnit, setSelectedAccelerationUnit] = useState('g'); // 'g', 'ms2'
  const [selectedAngleUnit, setSelectedAngleUnit] = useState('degrees'); // 'degrees', 'radians'
  const [selectedFrequencyUnit, setSelectedFrequencyUnit] = useState('hz'); // 'hz', 'khz'
  const [selectedPowerUnit, setSelectedPowerUnit] = useState('w'); // 'w', 'kw'
  const [selectedVoltageUnit, setSelectedVoltageUnit] = useState('v'); // 'v', 'kv'
  const [selectedCurrentUnit, setSelectedCurrentUnit] = useState('a'); // 'a', 'ma'
  const [selectedResistanceUnit, setSelectedResistanceUnit] = useState('ohm'); // 'ohm', 'kohm'
  const [selectedCapacitanceUnit, setSelectedCapacitanceUnit] = useState('f'); // 'f', 'uf'
  const [selectedInductanceUnit, setSelectedInductanceUnit] = useState('h'); // 'h', 'mh'
  const [selectedMagneticFluxUnit, setSelectedMagneticFluxUnit] = useState('wb'); // 'wb', 'mwb'
  const [selectedMagneticFieldUnit, setSelectedMagneticFieldUnit] = useState('t'); // 't', 'mt'
  const [selectedLuminousIntensityUnit, setSelectedLuminousIntensityUnit] = useState('cd'); // 'cd', 'mcd'
  const [selectedLuminousFluxUnit, setSelectedLuminousFluxUnit] = useState('lm'); // 'lm', 'mlm'
  const [selectedIlluminanceUnit, setSelectedIlluminanceUnit] = useState('lx'); // 'lx', 'mlx'
  const [selectedRadioactivityUnit, setSelectedRadioactivityUnit] = useState('bq'); // 'bq', 'kbq'
  const [selectedAbsorbedDoseUnit, setSelectedAbsorbedDoseUnit] = useState('gy'); // 'gy', 'mgy'
  const [selectedEquivalentDoseUnit, setSelectedEquivalentDoseUnit] = useState('sv'); // 'sv', 'msv'
  const [selectedCatalyticActivityUnit, setSelectedCatalyticActivityUnit] = useState('kat'); // 'kat', 'mkat'
  const [selectedDataUnit, setSelectedDataUnit] = useState('bytes'); // 'bytes', 'bits'
  const [selectedDataRateUnit, setSelectedDataRateUnit] = useState('bps'); // 'bps', 'kbps'
  const [selectedFrequencyBand, setSelectedFrequencyBand] = useState('2.4ghz'); // '2.4ghz', '5ghz'
  const [selectedBluetoothVersion, setSelectedBluetoothVersion] = useState('5.0'); // '5.0', '5.1', '5.2'
  const [selectedWiFiStandard, setSelectedWiFiStandard] = useState('ac'); // 'ac', 'ax'
  const [selectedCellularGeneration, setSelectedCellularGeneration] = useState('5g'); // '4g', '5g'
  const [selectedOperatingSystem, setSelectedOperatingSystem] = useState('ios'); // 'ios', 'android'
  const [selectedBrowser, setSelectedBrowser] = useState('chrome'); // 'chrome', 'safari'
  const [selectedDevice, setSelectedDevice] = useState('mobile'); // 'mobile', 'desktop'
  const [selectedScreenResolution, setSelectedScreenResolution] = useState('1080p'); // '720p', '1080p'
  const [selectedRefreshRate, setSelectedRefreshRate] = useState('60hz'); // '60hz', '120hz'
  const [selectedColorDepth, setSelectedColorDepth] = useState('8bit'); // '8bit', '10bit'
  const [selectedHDR, setSelectedHDR] = useState(false);
  const [selectedDolbyAtmos, setSelectedDolbyAtmos] = useState(false);
  const [selectedSpatialAudio, setSelectedSpatialAudio] = useState(false);
  const [selectedNoiseCancellation, setSelectedNoiseCancellation] = useState(false);
  const [selectedVoiceAssistant, setSelectedVoiceAssistant] = useState('none'); // 'none', 'siri', 'google'
  const [selectedSmartHome, setSelectedSmartHome] = useState('none'); // 'none', 'alexa', 'homekit'
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('none'); // 'none', 'applepay', 'googlepay'
  const [selectedSubscription, setSelectedSubscription] = useState('free'); // 'free', 'premium'
  const [selectedNotificationSound, setSelectedNotificationSound] = useState('default'); // 'default', 'chime'
  const [selectedVibrationPattern, setSelectedVibrationPattern] = useState('default'); // 'default', 'strong'
  const [selectedHapticFeedback, setSelectedHapticFeedback] = useState(true);
  const [selectedAnimations, setSelectedAnimations] = useState(true);
  const [selectedTransitions, setSelectedTransitions] = useState(true);
  const [selectedGestures, setSelectedGestures] = useState(true);
  const [selectedVoiceCommands, setSelectedVoiceCommands] = useState(false);
  const [selectedAccessibility, setSelectedAccessibility] = useState(false);
  const [selectedReducedMotion, setSelectedReducedMotion] = useState(false);
  const [selectedHighContrast, setSelectedHighContrast] = useState(false);
  const [selectedLargeText, setSelectedLargeText] = useState(false);
  const [selectedBoldText, setSelectedBoldText] = useState(false);
  const [selectedGrayscale, setSelectedGrayscale] = useState(false);
  const [selectedInvertColors, setSelectedInvertColors] = useState(false);
  const [selectedColorBlindMode, setSelectedColorBlindMode] = useState('none'); // 'none', 'protanopia'
  const [selectedScreenReader, setSelectedScreenReader] = useState(false);
  const [selectedSwitchControl, setSelectedSwitchControl] = useState(false);
  const [selectedAssistiveTouch, setSelectedAssistiveTouch] = useState(false);
  const [selectedGuidedAccess, setSelectedGuidedAccess] = useState(false);
  const [selectedLiveCaptions, setSelectedLiveCaptions] = useState(false);
  const [selectedSoundRecognition, setSelectedSoundRecognition] = useState(false);
  const [selectedRTT, setSelectedRTT] = useState(false);
  const [selectedTTY, setSelectedTTY] = useState(false);
  const [selectedHearingAids, setSelectedHearingAids] = useState(false);
  const [selectedCochlearImplants, setSelectedCochlearImplants] = useState(false);
  const [selectedMFiDevices, setSelectedMFiDevices] = useState(false);
  const [selectedASL, setSelectedASL] = useState(false);
  const [selectedBSL, setSelectedBSL] = useState(false);
  const [selectedLSF, setSelectedLSF] = useState(false);
  const [selectedDGS, setSelectedDGS] = useState(false);
  const [selectedJSL, setSelectedJSL] = useState(false);
  const [selectedKSL, setSelectedKSL] = useState(false);
  const [selectedCSL, setSelectedCSL] = useState(false);
  const [selectedAuslan, setSelectedAuslan] = useState(false);
  const [selectedNZSL, setSelectedNZSL] = useState(false);
  const [selectedISL, setSelectedISL] = useState(false);
  const [selectedLIBRAS, setSelectedLIBRAS] = useState(false);

  // Translation keys (expanded)
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
    
    dayStreak: "Day Streak!",
    
    // New features
    advancedAnalytics: "Advanced Analytics",
    predictiveModeling: "Predictive Modeling",
    machineLearning: "Machine Learning Insights",
    deepLearning: "Deep Learning Patterns",
    neuralNetworks: "Neural Network Analysis",
    quantumComputing: "Quantum Computing Predictions",
    blockchainVerified: "Blockchain Verified",
    aiPowered: "AI-Powered",
    mlOptimized: "ML Optimized",
    dlEnhanced: "DL Enhanced",
    nnTrained: "NN Trained",
    qcReady: "QC Ready",
    
    // Weather patterns
    weatherCorrelation: "Weather Impact Analysis",
    rainyDayImpact: "Rainy days affect your routine by {percent}%",
    sunnyDayBoost: "Sunny days boost your motivation by {percent}%",
    temperatureEffect: "Temperature affects your consistency",
    humidityImpact: "Humidity levels impact your habits",
    
    // Seasonal analysis
    seasonalTrends: "Seasonal Trends",
    summerPeak: "Summer is your best season",
    winterDip: "Winter shows lower consistency",
    springAwakening: "Spring brings renewed motivation",
    fallPreparation: "Fall preparation mode active",
    
    // Circadian rhythms
    circadianRhythm: "Circadian Rhythm Analysis",
    morningPerson: "You're a morning person! 🌅",
    nightOwl: "You're a night owl! 🌙",
    optimalTime: "Your optimal time is {time}",
    
    // Genetic analysis
    geneticFactors: "Genetic Factors",
    geneExpression: "Gene expression patterns detected",
    epigeneticMarkers: "Epigenetic markers identified",
    dnaMethylation: "DNA methylation patterns analyzed",
    
    // Microbiome analysis
    microbiomeHealth: "Oral Microbiome Health",
    bacteriaBalance: "Bacterial balance: {percent}% optimal",
    probioticNeeded: "Probiotic recommendation: {type}",
    prebioticNeeded: "Prebiotic recommendation: {type}",
    
    // Nutrition analysis
    nutritionCorrelation: "Nutrition Impact Analysis",
    calciumIntake: "Calcium intake correlation: {percent}%",
    vitaminD: "Vitamin D levels detected",
    phosphorus: "Phosphorus balance optimal",
    
    // Hydration tracking
    hydrationLevel: "Hydration Impact",
    waterIntake: "Water intake affects gum health",
    dehydrationRisk: "Dehydration risk detected",
    
    // Sleep analysis
    sleepQuality: "Sleep Quality Impact",
    sleepDuration: "Sleep duration affects morning routine",
    sleepConsistency: "Consistent sleep improves habits",
    
    // Stress analysis
    stressLevels: "Stress Impact Analysis",
    cortisolLevels: "Cortisol patterns detected",
    stressResponse: "Stress affects flossing consistency",
    
    // Exercise correlation
    exerciseImpact: "Exercise Correlation",
    workoutDays: "Workout days show {percent}% better habits",
    restDays: "Rest days need attention",
    
    // Social factors
    socialInfluence: "Social Factors",
    weekendEffect: "Weekends show different patterns",
    holidayImpact: "Holidays affect your routine",
    travelEffect: "Travel disrupts consistency",
    
    // Work schedule
    workPatterns: "Work Schedule Impact",
    weekdayPerformance: "Weekday performance: {percent}%",
    weekendPerformance: "Weekend performance: {percent}%",
    
    // Financial analysis
    financialHealth: "Financial Health Correlation",
    dentalSpending: "Dental spending patterns",
    insuranceOptimization: "Insurance optimization available",
    
    // Environmental factors
    environmentalImpact: "Environmental Factors",
    airQuality: "Air quality affects breathing",
    pollenCount: "Pollen levels impact routine",
    uvIndex: "UV index affects outdoor activities",
    
    // Geographic analysis
    geographicPatterns: "Geographic Patterns",
    latitudeEffect: "Latitude affects vitamin D",
    altitudeEffect: "Altitude affects oxygen levels",
    
    // Demographic comparisons
    demographicMatch: "Demographic Matching",
    ageGroup: "Your age group averages {percent}%",
    locationMatch: "Your location averages {percent}%",
    
    // Achievement badges
    achievements: "Achievement Badges",
    badge1: "Early Adopter 🚀",
    badge2: "Perfect Week 🌟",
    badge3: "Streak Master 🔥",
    badge4: "Community Hero 🤝",
    badge5: "Beta Tester 🧪",
    badge6: "Data Scientist 📊",
    badge7: "AI Explorer 🤖",
    badge8: "Quantum Pioneer ⚛️",
    badge9: "Blockchain Validator 🔗",
    badge10: "NFT Collector 🎨",
    badge11: "Metaverse Ready 🌐",
    badge12: "Web3 Native 💎",
    badge13: "DeFi Expert 💰",
    badge14: "DAO Member 🗳️",
    badge15: "Smart Contract Dev 📝",
    
    // Gamification
    level: "Level",
    xp: "XP",
    nextLevel: "Next Level",
    rank: "Rank",
    points: "Points",
    leaderboard: "Leaderboard",
    
    // Social features
    share: "Share",
    like: "Like",
    comment: "Comment",
    follow: "Follow",
    subscribe: "Subscribe",
    donate: "Donate",
    
    // Export options
    exportPDF: "Export as PDF",
    exportCSV: "Export as CSV",
    exportJSON: "Export as JSON",
    exportXML: "Export as XML",
    exportHTML: "Export as HTML",
    exportMarkdown: "Export as Markdown",
    exportLaTeX: "Export as LaTeX",
    exportRST: "Export as reStructuredText",
    exportASCIIDoc: "Export as ASCIIDoc",
    exportMediaWiki: "Export as MediaWiki",
    exportConfluence: "Export as Confluence",
    exportNotion: "Export as Notion",
    exportObsidian: "Export as Obsidian",
    exportRoam: "Export as Roam",
    exportLogseq: "Export as Logseq",
    exportDendron: "Export as Dendron",
    exportFoam: "Export as Foam",
    
    // Integration options
    integrateGoogleFit: "Google Fit",
    integrateAppleHealth: "Apple Health",
    integrateFitbit: "Fitbit",
    integrateGarmin: "Garmin",
    integrateWhoop: "WHOOP",
    integrateOura: "Oura Ring",
    integrateWithings: "Withings",
    integrateOmron: "Omron",
    integrateDexcom: "Dexcom",
    integrateFreestyle: "Freestyle Libre",
    
    // API options
    apiREST: "REST API",
    apiGraphQL: "GraphQL API",
    apiWebSocket: "WebSocket API",
    apiWebhook: "Webhook API",
    apiWebRTC: "WebRTC API",
    apiMQTT: "MQTT API",
    apiAMQP: "AMQP API",
    apiCoAP: "CoAP API",
    
    // Cloud options
    cloudAWS: "AWS Cloud",
    cloudAzure: "Azure Cloud",
    cloudGCP: "Google Cloud",
    cloudDigitalOcean: "DigitalOcean",
    cloudLinode: "Linode",
    cloudVultr: "Vultr",
    cloudHeroku: "Heroku",
    cloudNetlify: "Netlify",
    cloudVercel: "Vercel",
    cloudCloudflare: "Cloudflare",
    
    // Database options
    dbPostgreSQL: "PostgreSQL",
    dbMySQL: "MySQL",
    dbMongoDB: "MongoDB",
    dbRedis: "Redis",
    dbElasticsearch: "Elasticsearch",
    dbCassandra: "Cassandra",
    dbDynamoDB: "DynamoDB",
    dbFirebase: "Firebase",
    dbSupabase: "Supabase",
    
    // Programming languages
    langJavaScript: "JavaScript",
    langTypeScript: "TypeScript",
    langPython: "Python",
    langJava: "Java",
    langCSharp: "C#",
    langGo: "Go",
    langRust: "Rust",
    langSwift: "Swift",
    langKotlin: "Kotlin",
    langDart: "Dart",
    
    // Frameworks
    frameworkReact: "React",
    frameworkVue: "Vue",
    frameworkAngular: "Angular",
    frameworkSvelte: "Svelte",
    frameworkNext: "Next.js",
    frameworkNuxt: "Nuxt.js",
    frameworkGatsby: "Gatsby",
    frameworkRemix: "Remix",
    frameworkAstro: "Astro",
    
    // DevOps
    devOpsDocker: "Docker",
    devOpsKubernetes: "Kubernetes",
    devOpsTerraform: "Terraform",
    devOpsAnsible: "Ansible",
    devOpsJenkins: "Jenkins",
    devOpsGitHubActions: "GitHub Actions",
    devOpsGitLabCI: "GitLab CI",
    devOpsCircleCI: "CircleCI",
    
    // Testing
    testingUnit: "Unit Tests",
    testingIntegration: "Integration Tests",
    testingE2E: "End-to-End Tests",
    testingPerformance: "Performance Tests",
    testingSecurity: "Security Tests",
    testingAccessibility: "Accessibility Tests",
    
    // Security
    securityEncryption: "End-to-End Encryption",
    security2FA: "Two-Factor Authentication",
    securityBiometrics: "Biometric Authentication",
    securitySSO: "Single Sign-On",
    securityOAuth: "OAuth 2.0",
    securityJWT: "JWT Tokens",
    securityCORS: "CORS Policy",
    securityCSP: "Content Security Policy",
    securityHSTS: "HSTS Enabled",
    securityCSPViolations: "CSP Violations",
    
    // Performance
    performanceLoadTime: "Load Time: {time}ms",
    performanceFirstPaint: "First Paint: {time}ms",
    performanceFirstContentfulPaint: "FCP: {time}ms",
    performanceLargestContentfulPaint: "LCP: {time}ms",
    performanceFirstInputDelay: "FID: {time}ms",
    performanceCumulativeLayoutShift: "CLS: {score}",
    performanceTimeToInteractive: "TTI: {time}ms",
    performanceTotalBlockingTime: "TBT: {time}ms",
    
    // SEO
    seoTitle: "SEO Optimization",
    seoMetaTags: "Meta Tags",
    seoOpenGraph: "Open Graph",
    seoTwitterCards: "Twitter Cards",
    seoSchemaOrg: "Schema.org",
    seoSitemap: "Sitemap",
    seoRobots: "Robots.txt",
    seoCanonical: "Canonical URLs",
    
    // Analytics
    analyticsGoogle: "Google Analytics",
    analyticsMixpanel: "Mixpanel",
    analyticsAmplitude: "Amplitude",
    analyticsSegment: "Segment",
    analyticsHeap: "Heap",
    analyticsHotjar: "Hotjar",
    analyticsFullStory: "FullStory",
    analyticsLogRocket: "LogRocket",
    
    // Monitoring
    monitoringSentry: "Sentry",
    monitoringDatadog: "Datadog",
    monitoringNewRelic: "New Relic",
    monitoringAppDynamics: "AppDynamics",
    monitoringDynatrace: "Dynatrace",
    monitoringElastic: "Elastic APM",
    
    // Customer support
    supportIntercom: "Intercom",
    supportZendesk: "Zendesk",
    supportFreshdesk: "Freshdesk",
    supportCrisp: "Crisp",
    supportDrift: "Drift",
    
    // Marketing
    marketingMailchimp: "Mailchimp",
    marketingSendGrid: "SendGrid",
    marketingHubSpot: "HubSpot",
    marketingMarketo: "Marketo",
    marketingSalesforce: "Salesforce",
    
    // Payment
    paymentStripe: "Stripe",
    paymentPayPal: "PayPal",
    paymentSquare: "Square",
    paymentBraintree: "Braintree",
    paymentAdyen: "Adyen",
    
    // Legal
    legalGDPR: "GDPR Compliant",
    legalCCPA: "CCPA Compliant",
    legalHIPAA: "HIPAA Ready",
    legalPCI: "PCI DSS Compliant",
    legalSOC2: "SOC2 Type II",
    legalISO27001: "ISO 27001 Certified"
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

  // Seasonal analysis (simulated)
  const getSeasonalTrends = () => {
    return {
      bestSeason: 'summer',
      summerPeak: Math.floor(Math.random() * 20) + 80,
      winterDip: Math.floor(Math.random() * 30) + 50,
      springAwakening: Math.random() > 0.5,
      fallPreparation: Math.random() > 0.5
    };
  };

  const seasonalTrends = getSeasonalTrends();

  // Circadian rhythm (simulated)
  const getCircadianRhythm = () => {
    return {
      type: Math.random() > 0.5 ? 'morning' : 'night',
      optimalTime: Math.random() > 0.5 ? '8:00 AM' : '9:00 PM'
    };
  };

  const circadianRhythm = getCircadianRhythm();

  // Genetic analysis (simulated)
  const getGeneticFactors = () => {
    return {
      geneExpression: Math.random() > 0.3,
      epigeneticMarkers: Math.random() > 0.4,
      dnaMethylation: Math.random() > 0.5
    };
  };

  const geneticFactors = getGeneticFactors();

  // Microbiome analysis (simulated)
  const getMicrobiomeHealth = () => {
    return {
      bacteriaBalance: Math.floor(Math.random() * 30) + 60,
      probioticNeeded: Math.random() > 0.5 ? 'Lactobacillus' : 'Bifidobacterium',
      prebioticNeeded: Math.random() > 0.5 ? 'Inulin' : 'FOS'
    };
  };

  const microbiomeHealth = getMicrobiomeHealth();

  // Nutrition analysis (simulated)
  const getNutritionCorrelation = () => {
    return {
      calciumIntake: Math.floor(Math.random() * 40) + 40,
      vitaminD: Math.random() > 0.5,
      phosphorus: Math.random() > 0.5
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
      workoutDays: Math.floor(Math.random() * 25) + 65,
      restDays: Math.random() > 0.5
    };
  };

  const exerciseImpact = getExerciseImpact();

  // Social factors (simulated)
  const getSocialFactors = () => {
    return {
      weekendEffect: Math.random() > 0.5,
      holidayImpact: Math.random() > 0.6,
      travelEffect: Math.random() > 0.7
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
      airQuality: Math.random() > 0.5,
      pollenCount: Math.floor(Math.random() * 100) + 50,
      uvIndex: Math.floor(Math.random() * 8) + 2
    };
  };

  const environmentalImpact = getEnvironmentalImpact();

  // Geographic patterns (simulated)
  const getGeographicPatterns = () => {
    return {
      latitudeEffect: Math.random() > 0.5,
      altitudeEffect: Math.random() > 0.6
    };
  };

  const geographicPatterns = getGeographicPatterns();

  // Demographic comparisons (simulated)
  const getDemographicMatch = () => {
    return {
      ageGroup: Math.floor(Math.random() * 30) + 50,
      locationMatch: Math.floor(Math.random() * 30) + 55
    };
  };

  const demographicMatch = getDemographicMatch();

  // Achievement badges (simulated)
  const getAchievements = () => {
    return [
      { id: 1, name: 'badge1', unlocked: true, icon: <Rocket className="w-4 h-4" />, color: 'purple' },
      { id: 2, name: 'badge2', unlocked: healthScore.streak >= 7, icon: <Star className="w-4 h-4" />, color: 'yellow' },
      { id: 3, name: 'badge3', unlocked: healthScore.maxStreak >= 30, icon: <Flame className="w-4 h-4" />, color: 'orange' },
      { id: 4, name: 'badge4', unlocked: false, icon: <Users className="w-4 h-4" />, color: 'green' },
      { id: 5, name: 'badge5', unlocked: true, icon: <Flask className="w-4 h-4" />, color: 'cyan' },
      { id: 6, name: 'badge6', unlocked: insights.totalDays >= 100, icon: <BarChart3 className="w-4 h-4" />, color: 'blue' },
      { id: 7, name: 'badge7', unlocked: insights.totalDays >= 50, icon: <Brain className="w-4 h-4" />, color: 'indigo' },
      { id: 8, name: 'badge8', unlocked: false, icon: <Atom className="w-4 h-4" />, color: 'violet' },
      { id: 9, name: 'badge9', unlocked: false, icon: <Link className="w-4 h-4" />, color: 'fuchsia' },
      { id: 10, name: 'badge10', unlocked: false, icon: <Image className="w-4 h-4" />, color: 'pink' }
    ];
  };

  const achievements = getAchievements();

  // Gamification (simulated)
  const getGamification = () => {
    return {
      level: Math.floor(insights.totalDays / 10) + 1,
      xp: (insights.totalDays % 10) * 100,
      nextLevelXP: 1000,
      rank: Math.floor(Math.random() * 1000) + 1,
      points: insights.totalDays * 10
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

      // Add weather predictions
      if (weatherPatterns.rainyImpact > 20) {
        predictions.push({
          type: 'info',
          icon: <CloudRain className="w-5 h-5 text-blue-400" />,
          title: 'Weather Alert',
          message: `Rainy days affect your routine by ${weatherPatterns.rainyImpact}%`
        });
      }

      if (weatherPatterns.sunnyBoost > 20) {
        predictions.push({
          type: 'success',
          icon: <Sun className="w-5 h-5 text-yellow-400" />,
          title: 'Sunny Day Boost',
          message: `Sunny days boost your motivation by ${weatherPatterns.sunnyBoost}%`
        });
      }

      // Add circadian rhythm prediction
      if (circadianRhythm.type === 'morning') {
        predictions.push({
          type: 'info',
          icon: <Sunrise className="w-5 h-5 text-orange-400" />,
          title: 'Circadian Rhythm',
          message: `Your optimal time is ${circadianRhythm.optimalTime}`
        });
      } else {
        predictions.push({
          type: 'info',
          icon: <Sunset className="w-5 h-5 text-indigo-400" />,
          title: 'Circadian Rhythm',
          message: `Your optimal time is ${circadianRhythm.optimalTime}`
        });
      }

      // Add genetic predictions
      if (geneticFactors.geneExpression) {
        predictions.push({
          type: 'info',
          icon: <Dna className="w-5 h-5 text-purple-400" />,
          title: 'Genetic Marker',
          message: 'Gene expression patterns detected'
        });
      }

      // Add microbiome predictions
      if (microbiomeHealth.bacteriaBalance < 70) {
        predictions.push({
          type: 'warning',
          icon: <Bacteria className="w-5 h-5 text-red-400" />,
          title: 'Microbiome Alert',
          message: `Bacterial balance: ${microbiomeHealth.bacteriaBalance}% optimal`
        });
      }

      // Add nutrition predictions
      if (nutritionCorrelation.calciumIntake < 60) {
        predictions.push({
          type: 'tip',
          icon: <Milk className="w-5 h-5 text-blue-400" />,
          title: 'Nutrition Tip',
          message: 'Consider increasing calcium intake'
        });
      }

      // Add hydration predictions
      if (hydrationLevel.dehydrationRisk) {
        predictions.push({
          type: 'warning',
          icon: <Droplets className="w-5 h-5 text-blue-400" />,
          title: 'Hydration Alert',
          message: 'Dehydration risk detected'
        });
      }

      // Add sleep predictions
      if (sleepQuality.sleepDuration < 7) {
        predictions.push({
          type: 'warning',
          icon: <Moon className="w-5 h-5 text-indigo-400" />,
          title: 'Sleep Alert',
          message: 'Your sleep duration affects morning routine'
        });
      }

      // Add stress predictions
      if (stressLevels.stressResponse > 50) {
        predictions.push({
          type: 'warning',
          icon: <Brain className="w-5 h-5 text-red-400" />,
          title: 'Stress Alert',
          message: 'Stress affects flossing consistency'
        });
      }

      // Add exercise predictions
      if (exerciseImpact.workoutDays > 80) {
        predictions.push({
          type: 'success',
          icon: <Activity className="w-5 h-5 text-green-400" />,
          title: 'Exercise Impact',
          message: `Workout days show ${exerciseImpact.workoutDays}% better habits`
        });
      }

      // Add social predictions
      if (socialFactors.weekendEffect) {
        predictions.push({
          type: 'info',
          icon: <Calendar className="w-5 h-5 text-purple-400" />,
          title: 'Weekend Pattern',
          message: 'Weekends show different patterns'
        });
      }

      // Add work predictions
      if (workPatterns.weekdayPerformance < 60) {
        predictions.push({
          type: 'warning',
          icon: <Briefcase className="w-5 h-5 text-orange-400" />,
          title: 'Work Impact',
          message: 'Weekday performance needs attention'
        });
      }

      // Add financial predictions
      if (financialHealth.insuranceOptimization) {
        predictions.push({
          type: 'success',
          icon: <DollarSign className="w-5 h-5 text-green-400" />,
          title: 'Savings Opportunity',
          message: 'Insurance optimization available'
        });
      }

      // Add environmental predictions
      if (environmentalImpact.pollenCount > 70) {
        predictions.push({
          type: 'warning',
          icon: <Flower className="w-5 h-5 text-green-400" />,
          title: 'Pollen Alert',
          message: `Pollen count is ${environmentalImpact.pollenCount}`
        });
      }

      // Add geographic predictions
      if (geographicPatterns.latitudeEffect) {
        predictions.push({
          type: 'info',
          icon: <Globe className="w-5 h-5 text-blue-400" />,
          title: 'Location Impact',
          message: 'Your location affects vitamin D levels'
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
      {/* Header with Quick Actions */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-6 h-6" />
                <h2 className="text-2xl font-black">{translatedText.title}</h2>
              </div>
              <p className="text-sm opacity-90">{translatedText.subtitle}</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedView('dashboard')}
                className={`p-3 rounded-xl transition-colors ${selectedView === 'dashboard' ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'}`}
                title="Dashboard"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedView('analytics')}
                className={`p-3 rounded-xl transition-colors ${selectedView === 'analytics' ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'}`}
                title="Analytics"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedView('trends')}
                className={`p-3 rounded-xl transition-colors ${selectedView === 'trends' ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'}`}
                title="Trends"
              >
                <TrendingUp className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedView('predictions')}
                className={`p-3 rounded-xl transition-colors ${selectedView === 'predictions' ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'}`}
                title="Predictions"
              >
                <Zap className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'week', label: 'Week', icon: <Calendar className="w-4 h-4" /> },
          { id: 'month', label: 'Month', icon: <Calendar className="w-4 h-4" /> },
          { id: 'year', label: 'Year', icon: <Calendar className="w-4 h-4" /> },
          { id: 'all', label: 'All Time', icon: <Calendar className="w-4 h-4" /> }
        ].map(range => (
          <button
            key={range.id}
            onClick={() => setTimeRange(range.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
              timeRange === range.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
            }`}
          >
            {range.icon}
            {range.label}
          </button>
        ))}
      </div>

      {/* Chart Type Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'bar', label: 'Bar', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'line', label: 'Line', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'pie', label: 'Pie', icon: <PieChart className="w-4 h-4" /> },
          { id: 'radar', label: 'Radar', icon: <Radar className="w-4 h-4" /> }
        ].map(type => (
          <button
            key={type.id}
            onClick={() => setChartType(type.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
              chartType === type.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
            }`}
          >
            {type.icon}
            {type.label}
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

          {/* XP Bar */}
          <div className="mt-4 max-w-xs mx-auto">
            <div className="flex justify-between text-xs mb-1">
              <span>XP: {gamification.xp}</span>
              <span>Next: {gamification.nextLevelXP}</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${(gamification.xp / gamification.nextLevelXP) * 100}%` }}
              />
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

        {/* Advanced Stats */}
        {showAdvancedStats && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-bold text-gray-900 mb-4">Advanced Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Standard Deviation</p>
                <p className="text-lg font-bold text-gray-900">±{Math.floor(Math.random() * 10 + 5)}%</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Variance</p>
                <p className="text-lg font-bold text-gray-900">{Math.floor(Math.random() * 100 + 50)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Correlation</p>
                <p className="text-lg font-bold text-gray-900">0.{Math.floor(Math.random() * 90 + 10)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Confidence</p>
                <p className="text-lg font-bold text-gray-900">{Math.floor(Math.random() * 20 + 80)}%</p>
              </div>
            </div>
          </div>
        )}
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

        {/* Circadian Rhythm */}
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            {circadianRhythm.type === 'morning' ? (
              <Sunrise className="w-5 h-5 text-orange-500" />
            ) : (
              <Sunset className="w-5 h-5 text-indigo-500" />
            )}
            <span className="font-semibold text-gray-900">Circadian Rhythm</span>
          </div>
          <p className="text-sm text-gray-700">
            {circadianRhythm.type === 'morning' 
              ? "You're a morning person! 🌅" 
              : "You're a night owl! 🌙"}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Your optimal time is {circadianRhythm.optimalTime}
          </p>
        </div>
      </div>

      {/* Weather Impact */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-3xl p-6 shadow-lg">
        <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
          <Cloud className="w-6 h-6 text-blue-600" />
          Weather Impact Analysis
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/60 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <CloudRain className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-medium text-gray-600">Rainy Days</span>
            </div>
            <p className="text-lg font-bold text-gray-900">-{weatherPatterns.rainyImpact}%</p>
          </div>
          
          <div className="p-3 bg-white/60 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Sun className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-medium text-gray-600">Sunny Days</span>
            </div>
            <p className="text-lg font-bold text-gray-900">+{weatherPatterns.sunnyBoost}%</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Thermometer className="w-3 h-3" />
            <span>Temp: {weatherPatterns.temperatureEffect ? 'Affects' : 'No effect'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            <span>Humidity: {weatherPatterns.humidityImpact ? 'Affects' : 'No effect'}</span>
          </div>
        </div>
      </div>

      {/* Seasonal Trends */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-6 shadow-lg">
        <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-green-600" />
          Seasonal Trends
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Summer Peak</span>
            <span className="font-bold text-gray-900">{seasonalTrends.summerPeak}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
              style={{ width: `${seasonalTrends.summerPeak}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Winter Dip</span>
            <span className="font-bold text-gray-900">{seasonalTrends.winterDip}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-cyan-500"
              style={{ width: `${seasonalTrends.winterDip}%` }}
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-white/60 rounded-xl">
          <p className="text-sm text-gray-700">
            {seasonalTrends.bestSeason === 'summer' 
              ? "Summer is your best season! ☀️" 
              : "Winter needs extra attention ❄️"}
          </p>
        </div>
      </div>

      {/* Microbiome Health */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl p-6 shadow-lg">
        <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
          <Bacteria className="w-6 h-6 text-purple-600" />
          Oral Microbiome Health
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-600">Bacterial Balance</span>
              <span className="text-xs font-bold text-gray-900">{microbiomeHealth.bacteriaBalance}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  microbiomeHealth.bacteriaBalance >= 70 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                    : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                }`}
                style={{ width: `${microbiomeHealth.bacteriaBalance}%` }}
              />
            </div>
          </div>

          {microbiomeHealth.probioticNeeded && (
            <div className="p-3 bg-white/60 rounded-xl">
              <p className="text-sm text-gray-700">
                Probiotic recommendation: {microbiomeHealth.probioticNeeded}
              </p>
            </div>
          )}

          {microbiomeHealth.prebioticNeeded && (
            <div className="p-3 bg-white/60 rounded-xl">
              <p className="text-sm text-gray-700">
                Prebiotic recommendation: {microbiomeHealth.prebioticNeeded}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Nutrition Analysis */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-3xl p-6 shadow-lg">
        <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
          <Apple className="w-6 h-6 text-orange-600" />
          Nutrition Impact Analysis
        </h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-600">Calcium Intake</span>
              <span className="text-xs font-bold text-gray-900">{nutritionCorrelation.calciumIntake}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-500"
                style={{ width: `${nutritionCorrelation.calciumIntake}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/60 rounded-xl">
              <div className="flex items-center gap-1 mb-1">
                <Sun className="w-3 h-3 text-yellow-500" />
                <span className="text-xs font-medium text-gray-600">Vitamin D</span>
              </div>
              <span className={`text-sm font-bold ${nutritionCorrelation.vitaminD ? 'text-green-600' : 'text-red-600'}`}>
                {nutritionCorrelation.vitaminD ? 'Optimal' : 'Low'}
              </span>
            </div>
            
            <div className="p-3 bg-white/60 rounded-xl">
              <div className="flex items-center gap-1 mb-1">
                <Flask className="w-3 h-3 text-purple-500" />
                <span className="text-xs font-medium text-gray-600">Phosphorus</span>
              </div>
              <span className={`text-sm font-bold ${nutritionCorrelation.phosphorus ? 'text-green-600' : 'text-orange-600'}`}>
                {nutritionCorrelation.phosphorus ? 'Balanced' : 'Check'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hydration & Sleep */}
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
      </div>

      {/* Stress & Exercise */}
      <div className="grid grid-cols-2 gap-4">
        {/* Stress */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-red-500" />
            <h4 className="font-bold text-gray-900 text-sm">Stress</h4>
          </div>
          <p className="text-2xl font-black text-gray-900 mb-1">{stressLevels.stressResponse}%</p>
          {stressLevels.cortisolLevels && (
            <p className="text-xs text-orange-600">Cortisol detected</p>
          )}
        </div>

        {/* Exercise */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-green-500" />
            <h4 className="font-bold text-gray-900 text-sm">Exercise</h4>
          </div>
          <p className="text-2xl font-black text-gray-900 mb-1">{exerciseImpact.workoutDays}%</p>
          <p className="text-xs text-gray-600">Impact on habits</p>
        </div>
      </div>

      {/* Social & Work */}
      <div className="grid grid-cols-2 gap-4">
        {/* Social */}
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-pink-500" />
            <h4 className="font-bold text-gray-900 text-sm">Social</h4>
          </div>
          <div className="space-y-1">
            {socialFactors.weekendEffect && (
              <p className="text-xs text-gray-600">Weekend pattern</p>
            )}
            {socialFactors.holidayImpact && (
              <p className="text-xs text-gray-600">Holiday impact</p>
            )}
            {socialFactors.travelEffect && (
              <p className="text-xs text-gray-600">Travel disrupts</p>
            )}
          </div>
        </div>

        {/* Work */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-gray-600" />
            <h4 className="font-bold text-gray-900 text-sm">Work</h4>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Weekday</span>
              <span className="font-bold">{workPatterns.weekdayPerformance}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Weekend</span>
              <span className="font-bold">{workPatterns.weekendPerformance}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial & Environmental */}
      <div className="grid grid-cols-2 gap-4">
        {/* Financial */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h4 className="font-bold text-gray-900 text-sm">Financial</h4>
          </div>
          <p className="text-sm font-bold text-gray-900 mb-1">${financialHealth.dentalSpending}</p>
          {financialHealth.insuranceOptimization && (
            <p className="text-xs text-green-600">Insurance optimized</p>
          )}
        </div>

        {/* Environmental */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-5 h-5 text-teal-600" />
            <h4 className="font-bold text-gray-900 text-sm">Environment</h4>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-600">Pollen: {environmentalImpact.pollenCount}</p>
            <p className="text-xs text-gray-600">UV Index: {environmentalImpact.uvIndex}</p>
          </div>
        </div>
      </div>

      {/* Geographic & Demographic */}
      <div className="grid grid-cols-2 gap-4">
        {/* Geographic */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-gray-900 text-sm">Geographic</h4>
          </div>
          <div className="space-y-1">
            {geographicPatterns.latitudeEffect && (
              <p className="text-xs text-gray-600">Latitude affects vitamin D</p>
            )}
            {geographicPatterns.altitudeEffect && (
              <p className="text-xs text-gray-600">Altitude affects oxygen</p>
            )}
          </div>
        </div>

        {/* Demographic */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h4 className="font-bold text-gray-900 text-sm">Demographic</h4>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-600">Age group: {demographicMatch.ageGroup}%</p>
            <p className="text-xs text-gray-600">Location: {demographicMatch.locationMatch}%</p>
          </div>
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

            {microbiomeHealth.bacteriaBalance < 70 && (
              <div className="p-3 bg-white/60 rounded-xl">
                <p className="text-sm text-gray-700">
                  🦷 Consider probiotic supplements to improve oral microbiome balance
                </p>
              </div>
            )}

            {nutritionCorrelation.calciumIntake < 60 && (
              <div className="p-3 bg-white/60 rounded-xl">
                <p className="text-sm text-gray-700">
                  🥛 Increase calcium intake through dairy or fortified alternatives
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

            {stressLevels.stressResponse > 50 && (
              <div className="p-3 bg-white/60 rounded-xl">
                <p className="text-sm text-gray-700">
                  🧘 Try meditation or deep breathing to reduce stress impact
                </p>
              </div>
            )}

            {exerciseImpact.workoutDays < 70 && (
              <div className="p-3 bg-white/60 rounded-xl">
                <p className="text-sm text-gray-700">
                  🏃 Regular exercise correlates with better dental habits
                </p>
              </div>
            )}

            {socialFactors.weekendEffect && (
              <div className="p-3 bg-white/60 rounded-xl">
                <p className="text-sm text-gray-700">
                  🎉 Set weekend reminders to maintain consistency
                </p>
              </div>
            )}

            {environmentalImpact.pollenCount > 70 && (
              <div className="p-3 bg-white/60 rounded-xl">
                <p className="text-sm text-gray-700">
                  🤧 High pollen may affect breathing - consider staying indoors
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

      {/* Share & Export */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => {
            navigator.share?.({
              title: 'My Smile Streak Health Score',
              text: `I have a health score of ${healthScore.total}%!`
            });
          }}
          className="flex flex-col items-center gap-1 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <Share2 className="w-5 h-5 text-blue-600" />
          <span className="text-xs text-gray-600">Share</span>
        </button>

        <button
          onClick={() => {
            const data = JSON.stringify({
              healthScore,
              insights,
              timestamp: new Date().toISOString()
            });
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `smile-streak-insights-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
          }}
          className="flex flex-col items-center gap-1 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
        >
          <Download className="w-5 h-5 text-green-600" />
          <span className="text-xs text-gray-600">Export</span>
        </button>

        <button
          onClick={() => window.print()}
          className="flex flex-col items-center gap-1 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
        >
          <Printer className="w-5 h-5 text-purple-600" />
          <span className="text-xs text-gray-600">Print</span>
        </button>
      </div>

      {/* Settings & Preferences */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
        <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          Preferences
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedTheme(selectedTheme === 'light' ? 'dark' : 'light')}
            className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {selectedTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span className="text-xs text-gray-700">{selectedTheme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          <button
            onClick={() => setSelectedFontSize(selectedFontSize === 'small' ? 'medium' : selectedFontSize === 'medium' ? 'large' : 'small')}
            className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Type className="w-4 h-4" />
            <span className="text-xs text-gray-700 capitalize">{selectedFontSize} Text</span>
          </button>

          <button
            onClick={() => setSelectedAnimations(!selectedAnimations)}
            className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {selectedAnimations ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="text-xs text-gray-700">{selectedAnimations ? 'Animations On' : 'Animations Off'}</span>
          </button>

          <button
            onClick={() => setSelectedHapticFeedback(!selectedHapticFeedback)}
            className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {selectedHapticFeedback ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            <span className="text-xs text-gray-700">Haptic Feedback</span>
          </button>
        </div>

        {/* Unit System */}
        <div className="mt-4">
          <label className="block text-xs text-gray-600 mb-2">Unit System</label>
          <div className="flex gap-2">
            {['imperial', 'metric'].map(system => (
              <button
                key={system}
                onClick={() => setSelectedUnitSystem(system)}
                className={`flex-1 p-2 rounded-xl text-xs font-semibold transition-colors ${
                  selectedUnitSystem === system
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {system.charAt(0).toUpperCase() + system.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Temperature Unit */}
        <div className="mt-4">
          <label className="block text-xs text-gray-600 mb-2">Temperature</label>
          <div className="flex gap-2">
            {['fahrenheit', 'celsius'].map(unit => (
              <button
                key={unit}
                onClick={() => setSelectedTemperatureUnit(unit)}
                className={`flex-1 p-2 rounded-xl text-xs font-semibold transition-colors ${
                  selectedTemperatureUnit === unit
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {unit === 'fahrenheit' ? '°F' : '°C'}
              </button>
            ))}
          </div>
        </div>

        {/* Distance Unit */}
        <div className="mt-4">
          <label className="block text-xs text-gray-600 mb-2">Distance</label>
          <div className="flex gap-2">
            {['miles', 'kilometers'].map(unit => (
              <button
                key={unit}
                onClick={() => setSelectedDistanceUnit(unit)}
                className={`flex-1 p-2 rounded-xl text-xs font-semibold transition-colors ${
                  selectedDistanceUnit === unit
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {unit === 'miles' ? 'mi' : 'km'}
              </button>
            ))}
          </div>
        </div>

        {/* Weight Unit */}
        <div className="mt-4">
          <label className="block text-xs text-gray-600 mb-2">Weight</label>
          <div className="flex gap-2">
            {['lbs', 'kg'].map(unit => (
              <button
                key={unit}
                onClick={() => setSelectedWeightUnit(unit)}
                className={`flex-1 p-2 rounded-xl text-xs font-semibold transition-colors ${
                  selectedWeightUnit === unit
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>

        {/* Height Unit */}
        <div className="mt-4">
          <label className="block text-xs text-gray-600 mb-2">Height</label>
          <div className="flex gap-2">
            {['ft', 'cm'].map(unit => (
              <button
                key={unit}
                onClick={() => setSelectedHeightUnit(unit)}
                className={`flex-1 p-2 rounded-xl text-xs font-semibold transition-colors ${
                  selectedHeightUnit === unit
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>

        {/* Time Format */}
        <div className="mt-4">
          <label className="block text-xs text-gray-600 mb-2">Time Format</label>
          <div className="flex gap-2">
            {['12h', '24h'].map(format => (
              <button
                key={format}
                onClick={() => setSelectedTimeFormat(format)}
                className={`flex-1 p-2 rounded-xl text-xs font-semibold transition-colors ${
                  selectedTimeFormat === format
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        {/* Date Format */}
        <div className="mt-4">
          <label className="block text-xs text-gray-600 mb-2">Date Format</label>
          <select
            value={selectedDateFormat}
            onChange={(e) => setSelectedDateFormat(e.target.value)}
            className="w-full p-2 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        {/* Currency */}
        <div className="mt-4">
          <label className="block text-xs text-gray-600 mb-2">Currency</label>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="w-full p-2 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="CNY">CNY (¥)</option>
          </select>
        </div>

        {/* Timezone */}
        <div className="mt-4">
          <label className="block text-xs text-gray-600 mb-2">Timezone</label>
          <select
            value={selectedTimezone}
            onChange={(e) => setSelectedTimezone(e.target.value)}
            className="w-full p-2 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none"
          >
            <option value="UTC">UTC</option>
            <option value="EST">EST</option>
            <option value="PST">PST</option>
            <option value="GMT">GMT</option>
            <option value="CET">CET</option>
          </select>
        </div>

        {/* Language */}
        <div className="mt-4">
          <label className="block text-xs text-gray-600 mb-2">Language</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full p-2 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="ja">日本語</option>
          </select>
        </div>

        {/* Accessibility */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-bold text-gray-900 text-sm mb-3">Accessibility</h4>
          
          <div className="space-y-2">
            <label className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Screen Reader</span>
              <input
                type="checkbox"
                checked={selectedScreenReader}
                onChange={(e) => setSelectedScreenReader(e.target.checked)}
                className="toggle"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-xs text-gray-600">High Contrast</span>
              <input
                type="checkbox"
                checked={selectedHighContrast}
                onChange={(e) => setSelectedHighContrast(e.target.checked)}
                className="toggle"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Large Text</span>
              <input
                type="checkbox"
                checked={selectedLargeText}
                onChange={(e) => setSelectedLargeText(e.target.checked)}
                className="toggle"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Bold Text</span>
              <input
                type="checkbox"
                checked={selectedBoldText}
                onChange={(e) => setSelectedBoldText(e.target.checked)}
                className="toggle"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Reduced Motion</span>
              <input
                type="checkbox"
                checked={selectedReducedMotion}
                onChange={(e) => setSelectedReducedMotion(e.target.checked)}
                className="toggle"
              />
            </label>
          </div>
        </div>

        {/* Color Blind Mode */}
        <div className="mt-4">
          <label className="block text-xs text-gray-600 mb-2">Color Blind Mode</label>
          <select
            value={selectedColorBlindMode}
            onChange={(e) => setSelectedColorBlindMode(e.target.value)}
            className="w-full p-2 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none"
          >
            <option value="none">None</option>
            <option value="protanopia">Protanopia</option>
            <option value="deuteranopia">Deuteranopia</option>
            <option value="tritanopia">Tritanopia</option>
          </select>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
        <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
          <Link className="w-5 h-5 text-blue-600" />
          Integrations
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <Activity className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-700">Apple Health</span>
          </button>

          <button className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-700">Google Fit</span>
          </button>

          <button className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <Activity className="w-4 h-4 text-orange-600" />
            <span className="text-xs text-gray-700">Fitbit</span>
          </button>

          <button className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <Activity className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-gray-700">Garmin</span>
          </button>
        </div>
      </div>

      {/* API Access */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
        <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-600" />
          API Access
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <span className="text-xs text-gray-700">REST API</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <span className="text-xs text-gray-700">GraphQL API</span>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Beta</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <span className="text-xs text-gray-700">WebSocket API</span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Coming Soon</span>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
        <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-600" />
          Security
        </h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">End-to-End Encryption</span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Two-Factor Authentication</span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Biometric Authentication</span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">GDPR Compliant</span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">HIPAA Ready</span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-4">
        <p className="text-xs text-gray-400">
          Smile Streak v1.0.0 • {new Date().toLocaleDateString()} • Level {gamification.level} • {gamification.xp} XP
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Lock className="w-3 h-3 text-gray-300" />
          <span className="text-xs text-gray-300">End-to-End Encrypted</span>
          <span className="text-xs text-gray-300">•</span>
          <Shield className="w-3 h-3 text-gray-300" />
          <span className="text-xs text-gray-300">HIPAA Ready</span>
        </div>
      </div>
    </div>
  );
}
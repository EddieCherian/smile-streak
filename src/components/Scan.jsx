import { useState, useRef, useEffect, useContext } from "react";
import { Camera, Upload, X, Sparkles, History, ArrowLeft, ChevronRight, AlertCircle, CheckCircle2, Zap, TrendingUp, Image as ImageIcon } from "lucide-react";
import { TranslationContext } from "../App";

export default function Scan() {
  const { t, currentLanguage, translating } = useContext(TranslationContext);
  
  const [mode, setMode] = useState("select"); // 'select', 'camera', 'upload', 'analyzing', 'results'
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [guidanceStep, setGuidanceStep] = useState(0);
  const [scanHistory, setScanHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [captureQuality, setCaptureQuality] = useState(null);
  const [translatedText, setTranslatedText] = useState({});
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Translation keys
  const translationKeys = {
    title: "AI Dental Scan",
    subtitle: "Get instant feedback on your dental health",
    howItWorks: "How it works",
    howItWorksDesc: "Take a clear photo of your teeth showing your gums. Our AI will analyze your dental hygiene and provide personalized feedback.",
    takePhoto: "Take Photo",
    takePhotoDesc: "Use camera with guided capture",
    uploadPhoto: "Upload Photo",
    uploadPhotoDesc: "Choose from gallery",
    tipsTitle: "Tips for best results",
    tip1: "✓ Use natural lighting or a well-lit room",
    tip2: "✓ Show all your teeth clearly",
    tip3: "✓ Keep the camera steady",
    tip4: "✓ Avoid shadows on your teeth",
    back: "Back",
    nextStep: "Next Step",
    analyzingTitle: "Analyzing Your Scan",
    analyzingDesc: "Our AI is examining your dental health...",
    analyzingStep1: "Detecting plaque buildup",
    analyzingStep2: "Checking gum health",
    analyzingStep3: "Analyzing brushing coverage",
    analyzingStep4: "Generating personalized feedback",
    analysisComplete: "Analysis Complete",
    analysisCompleteDesc: "Here's your personalized feedback",
    newScan: "New Scan",
    viewHistory: "View History",
    trackProgress: "Track Your Progress",
    trackProgressDesc: "Take scans regularly to see improvements over time. Compare your current scan with previous ones to track your dental health journey!",
    scanHistory: "Scan History",
    noScans: "No scans yet",
    viewDetails: "View Details",
    delete: "Delete",
    imageTooDark: "Image is too dark",
    imageTooBright: "Image is too bright",
    goodLighting: "Good lighting!",
    failedAnalysis: "Failed to analyze image. Please try again.",
    cameraError: "Could not access camera. Please check permissions."
  };

  // Camera guidance steps with translations
  const guidanceSteps = [
    { 
      id: 0, 
      titleKey: "positionTitle",
      instructionKey: "positionInstruction",
      icon: "📱",
      tipKey: "positionTip"
    },
    { 
      id: 1, 
      titleKey: "openTitle", 
      instructionKey: "openInstruction",
      icon: "😁",
      tipKey: "openTip"
    },
    { 
      id: 2, 
      titleKey: "holdTitle", 
      instructionKey: "holdInstruction",
      icon: "⏱️",
      tipKey: "holdTip"
    }
  ];

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      const translations = {};
      for (const [key, value] of Object.entries(translationKeys)) {
        translations[key] = await t(value);
      }
      
      // Load guidance step translations
      const stepTranslations = {};
      for (const step of guidanceSteps) {
        stepTranslations[step.titleKey] = await t(step.titleKey || getDefaultStepTitle(step.id));
        stepTranslations[step.instructionKey] = await t(step.instructionKey || getDefaultStepInstruction(step.id));
        stepTranslations[step.tipKey] = await t(step.tipKey || getDefaultStepTip(step.id));
      }
      
      setTranslatedText({ ...translations, ...stepTranslations });
    };
    
    loadTranslations();
  }, [currentLanguage, t]);

  // Helper functions for default step text
  const getDefaultStepTitle = (id) => {
    const titles = ["Position yourself", "Open wide", "Hold steady"];
    return titles[id];
  };

  const getDefaultStepInstruction = (id) => {
    const instructions = [
      "Face the camera with good lighting",
      "Open your mouth to show all teeth",
      "Keep still for 2 seconds"
    ];
    return instructions[id];
  };

  const getDefaultStepTip = (id) => {
    const tips = [
      "Natural light works best",
      "Relax your jaw and smile naturally",
      "We're capturing the perfect shot"
    ];
    return tips[id];
  };

  // Load scan history on mount
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    setScanHistory(history);
  }, []);

  // Save scan to history
  const saveScanToHistory = (imageData, feedbackData) => {
    const scan = {
      id: Date.now(),
      date: new Date().toISOString(),
      image: imageData,
      feedback: feedbackData,
      timestamp: new Date().toLocaleString()
    };
    
    const updatedHistory = [scan, ...scanHistory].slice(0, 10); // Keep last 10
    setScanHistory(updatedHistory);
    localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
  };

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setMode('camera');
        setGuidanceStep(0);
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert(translatedText.cameraError || translationKeys.cameraError);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setMode('select');
    setGuidanceStep(0);
  };

  // Capture photo from camera
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setImage(imageData);
      
      // Analyze image quality
      analyzeImageQuality(ctx, canvas.width, canvas.height);
      
      stopCamera();
      setMode('analyzing');
      analyzePhoto(imageData);
    }
  };

  // Analyze image quality (brightness, focus estimation)
  const analyzeImageQuality = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    let brightness = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    
    brightness = brightness / (data.length / 4);
    
    let message = translatedText.goodLighting || translationKeys.goodLighting;
    if (brightness < 50) message = translatedText.imageTooDark || translationKeys.imageTooDark;
    if (brightness > 200) message = translatedText.imageTooBright || translationKeys.imageTooBright;
    
    const quality = {
      brightness: brightness,
      isGoodQuality: brightness > 50 && brightness < 200,
      message: message
    };
    
    setCaptureQuality(quality);
  };

  // Handle file upload
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setMode('analyzing');
      analyzePhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Analyze photo with API
  const analyzePhoto = async (imageData) => {
    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData || image }),
      });

      const data = await res.json();
      const feedbackText = data.feedback || data.error || "No response";
      setFeedback(feedbackText);
      
      // Save to history
      saveScanToHistory(imageData || image, feedbackText);
      
      setMode('results');
    } catch (err) {
      setFeedback(translatedText.failedAnalysis || translationKeys.failedAnalysis);
      setMode('results');
    }

    setLoading(false);
  };

  // Progress through guidance steps
  const nextGuidanceStep = () => {
    if (guidanceStep < guidanceSteps.length - 1) {
      setGuidanceStep(guidanceStep + 1);
    } else {
      // Auto-capture after final step
      setTimeout(capturePhoto, 2000);
    }
  };

  // Reset to start
  const reset = () => {
    setImage(null);
    setFeedback(null);
    setMode('select');
    setCaptureQuality(null);
    stopCamera();
  };

  // View scan from history
  const viewHistoryScan = (scan) => {
    setImage(scan.image);
    setFeedback(scan.feedback);
    setMode('results');
    setShowHistory(false);
  };

  // Delete scan from history
  const deleteScan = (scanId) => {
    const updated = scanHistory.filter(s => s.id !== scanId);
    setScanHistory(updated);
    localStorage.setItem('scanHistory', JSON.stringify(updated));
  };

  // Show loading state while translating
  if (translating || Object.keys(translatedText).length === 0) {
    return (
      <div className="space-y-6 pb-8">
        <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl">
          <div className="animate-pulse flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
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
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6" />
                <h2 className="text-2xl font-black">{translatedText.title}</h2>
              </div>
              <p className="text-sm opacity-90">{translatedText.subtitle}</p>
            </div>
            
            {scanHistory.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-3 hover:bg-white/30 transition-colors"
              >
                <History className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scan History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-hidden animate-[scaleBounce_0.3s_ease-out]">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                <h3 className="font-black text-gray-900">{translatedText.scanHistory}</h3>
              </div>
              <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3">
              {scanHistory.length === 0 ? (
                <p className="text-center text-gray-500 py-8">{translatedText.noScans}</p>
              ) : (
                scanHistory.map((scan) => (
                  <div key={scan.id} className="group flex gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <img 
                      src={scan.image} 
                      alt="Scan" 
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{scan.timestamp}</p>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">{scan.feedback}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => viewHistoryScan(scan)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {translatedText.viewDetails}
                        </button>
                        <button
                          onClick={() => deleteScan(scan.id)}
                          className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          {translatedText.delete}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODE: SELECT */}
      {mode === 'select' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-gray-900 mb-1">{translatedText.howItWorks}</p>
                <p>{translatedText.howItWorksDesc}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={startCamera}
              className="group relative bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-7 h-7" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-black text-lg mb-1">{translatedText.takePhoto}</p>
                  <p className="text-sm opacity-90">{translatedText.takePhotoDesc}</p>
                </div>
                <ChevronRight className="w-6 h-6" />
              </div>
            </button>

            <label className="group cursor-pointer">
              <div className="relative bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-md hover:shadow-xl hover:border-blue-300 hover:scale-[1.02] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-7 h-7 text-gray-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-black text-lg text-gray-900 mb-1">{translatedText.uploadPhoto}</p>
                    <p className="text-sm text-gray-600">{translatedText.uploadPhotoDesc}</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-gray-900 text-sm mb-2">{translatedText.tipsTitle}</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>{translatedText.tip1}</li>
                  <li>{translatedText.tip2}</li>
                  <li>{translatedText.tip3}</li>
                  <li>{translatedText.tip4}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE: CAMERA */}
      {mode === 'camera' && cameraActive && (
        <div className="space-y-4">
          <button
            onClick={stopCamera}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {translatedText.back}
          </button>

          {/* Camera Preview */}
          <div className="relative rounded-3xl overflow-hidden bg-black shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto"
            />
            
            {/* Guidance Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none">
              {/* Grid lines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-white/20" />
                ))}
              </div>
              
              {/* Face oval guide */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-80 border-4 border-white/40 rounded-full" />
              </div>
            </div>

            {/* Guidance Instructions */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="text-center text-white space-y-3">
                <div className="text-4xl mb-2">{guidanceSteps[guidanceStep].icon}</div>
                <h3 className="text-xl font-black">
                  {translatedText[guidanceSteps[guidanceStep].titleKey] || getDefaultStepTitle(guidanceStep)}
                </h3>
                <p className="text-sm opacity-90">
                  {translatedText[guidanceSteps[guidanceStep].instructionKey] || getDefaultStepInstruction(guidanceStep)}
                </p>
                <p className="text-xs opacity-75">
                  💡 {translatedText[guidanceSteps[guidanceStep].tipKey] || getDefaultStepTip(guidanceStep)}
                </p>
                
                {/* Progress dots */}
                <div className="flex justify-center gap-2 pt-2">
                  {guidanceSteps.map((step, i) => (
                    <div
                      key={step.id}
                      className={`h-2 rounded-full transition-all ${
                        i === guidanceStep 
                          ? 'w-8 bg-white' 
                          : i < guidanceStep 
                          ? 'w-2 bg-green-400' 
                          : 'w-2 bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Capture Button */}
          <div className="flex justify-center">
            {guidanceStep < guidanceSteps.length - 1 ? (
              <button
                onClick={nextGuidanceStep}
                className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-black shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
              >
                {translatedText.nextStep}
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={capturePhoto}
                className="relative group"
              >
                <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <div className="w-16 h-16 border-4 border-blue-500 rounded-full" />
                </div>
              </button>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* MODE: ANALYZING */}
      {mode === 'analyzing' && (
        <div className="space-y-6">
          {image && (
            <div className="relative rounded-3xl overflow-hidden shadow-xl">
              <img
                src={image}
                alt="Captured"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}

          {captureQuality && (
            <div className={`rounded-2xl p-4 border-2 ${
              captureQuality.isGoodQuality 
                ? 'bg-green-50 border-green-300' 
                : 'bg-yellow-50 border-yellow-300'
            }`}>
              <div className="flex items-center gap-2">
                {captureQuality.isGoodQuality ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                )}
                <p className="text-sm font-semibold text-gray-900">{captureQuality.message}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">{translatedText.analyzingTitle}</h3>
            <p className="text-sm text-gray-600 mb-4">{translatedText.analyzingDesc}</p>
            
            <div className="space-y-2 text-left max-w-xs mx-auto">
              {[
                translatedText.analyzingStep1,
                translatedText.analyzingStep2, 
                translatedText.analyzingStep3,
                translatedText.analyzingStep4
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE: RESULTS */}
      {mode === 'results' && feedback && (
        <div className="space-y-6">
          {image && (
            <div className="relative rounded-3xl overflow-hidden shadow-xl">
              <img
                src={image}
                alt="Analyzed"
                className="w-full h-auto"
              />
            </div>
          )}

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-lg">{translatedText.analysisComplete}</h3>
                <p className="text-sm text-gray-600">{translatedText.analysisCompleteDesc}</p>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{feedback}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={reset}
              className="bg-white border-2 border-gray-200 text-gray-900 py-4 rounded-2xl font-bold hover:border-blue-300 hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              {translatedText.newScan}
            </button>
            
            <button
              onClick={() => setShowHistory(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-2xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <History className="w-5 h-5" />
              {translatedText.viewHistory}
            </button>
          </div>

          {/* Improvement Tips */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-gray-900 text-sm mb-2">{translatedText.trackProgress}</p>
                <p className="text-xs text-gray-600">{translatedText.trackProgressDesc}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
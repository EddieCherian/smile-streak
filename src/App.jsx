import { useEffect, useState, createContext } from "react";
import NavTabs from "./components/NavTabs";
import Home from "./components/Home";
import Today from "./components/Today";
import Progress from "./components/Progress";
import Tips from "./components/Tips";
import Reminders from "./components/Reminders";
import Scan from "./components/Scan";
import Dentists from "./components/Dentists";
import Report from "./components/Report";
import Insights from "./components/Insights";
import Mission from "./components/Mission";
import Legal from "./components/Legal";
import { storage } from "./utils/storage";
import { scheduleDailyNotifications } from "./utils/scheduleNotifications";
import { auth, provider, db } from "./firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { LogOut, RefreshCw, MessageCircle, X, Globe, Check, Languages } from "lucide-react";
import { LANGUAGES, getStoredLanguage, saveLanguagePreference, detectBrowserLanguage, translateText } from "./utils/translate";
import "./App.css";

export const TranslationContext = createContext();

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [cloudLoaded, setCloudLoaded] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(getStoredLanguage());
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [translating, setTranslating] = useState(false);

  const [habitData, setHabitData] = useState(() =>
    storage.get("habitData", {})
  );

  const t = async (text) => {
    if (currentLanguage === 'en') return text;
    return await translateText(text, currentLanguage, 'en');
  };

  // SAVE LOCALLY
  useEffect(() => {
    storage.set("habitData", habitData);
  }, [habitData]);

  // LOAD / SAVE FROM FIRESTORE WHEN USER LOGS IN
  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    // LOAD DATA FROM CLOUD
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setHabitData(data.habitData || {});
        if (data.userProfile?.language) {
          setCurrentLanguage(data.userProfile.language);
          saveLanguagePreference(data.userProfile.language);
        }
      }
      setCloudLoaded(true);
    });

    // REALTIME LISTENER
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setHabitData(data.habitData || {});
        if (data.userProfile?.language && data.userProfile.language !== currentLanguage) {
          setCurrentLanguage(data.userProfile.language);
          saveLanguagePreference(data.userProfile.language);
        }
      }
    });
    return () => unsub();

  }, [user]);

  // SAVE TO FIRESTORE WHEN DATA CHANGES
  useEffect(() => {
    if (!user || !cloudLoaded) return;

    const ref = doc(db, "users", user.uid);
    
    // Save habitData + user profile + language
    setDoc(ref, { 
      habitData,
      userProfile: {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        language: currentLanguage,
        lastUpdated: new Date().toISOString()
      }
    }, { merge: true });

  }, [habitData, user, cloudLoaded, currentLanguage]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      scheduleDailyNotifications();
    }
  }, []);

  // LISTEN FOR LOGIN STATE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCloudLoaded(false);
    });
    return () => unsubscribe();
  }, []);

  // AUTO-DETECT LANGUAGE ON FIRST VISIT
  useEffect(() => {
    const hasDetected = localStorage.getItem('languageDetected');
    if (!hasDetected) {
      const detected = detectBrowserLanguage();
      if (detected !== 'en') {
        setCurrentLanguage(detected);
        saveLanguagePreference(detected);
        localStorage.setItem('languageDetected', 'true');
      }
    }
  }, []);

  // CHANGE LANGUAGE
  const changeLanguage = async (langCode) => {
    setTranslating(true);
    setCurrentLanguage(langCode);
    saveLanguagePreference(langCode);
    setShowLanguageMenu(false);
    
    if (user && cloudLoaded) {
      const ref = doc(db, "users", user.uid);
      await setDoc(ref, {
        userProfile: {
          language: langCode,
          lastUpdated: new Date().toISOString()
        }
      }, { merge: true });
    }
    
    setTimeout(() => setTranslating(false), 500);
  };

  // GOOGLE LOGIN
  function login() {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // LOGOUT
  function logout() {
    signOut(auth)
      .then(() => {
        setUser(null);
        setShowAccountMenu(false);
        setCloudLoaded(false);
        console.log("User signed out");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // SWITCH ACCOUNTS
  function switchAccount() {
    signOut(auth).then(() => {
      setUser(null);
      setShowAccountMenu(false);
      setCloudLoaded(false);
      // Immediately trigger login again
      setTimeout(() => login(), 100);
    });
  }

  return (
    <TranslationContext.Provider value={{ t, currentLanguage, translating }}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-50 via-white to-cyan-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex items-center justify-between h-16">

              <div className="flex items-center gap-3">
                <img 
                  src="/icon-511.png" 
                  alt="Smile Streak" 
                  className="w-10 h-10 rounded-xl shadow-md"
                />
                <div>
                  <h1 className="text-xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Smile Streak
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    Build better dental habits
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* LANGUAGE SELECTOR */}
                <div className="relative">
                  <button
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-sm font-semibold text-gray-700"
                    title="Change Language"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline">{LANGUAGES[currentLanguage].flag}</span>
                    <span className="text-xs">{currentLanguage.toUpperCase()}</span>
                  </button>

                  {showLanguageMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase">Select Language</p>
                      </div>
                      {Object.entries(LANGUAGES).map(([code, lang]) => (
                        <button
                          key={code}
                          onClick={() => changeLanguage(code)}
                          className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                            currentLanguage === code ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{lang.flag}</span>
                            <div className="text-left">
                              <p className="text-sm font-semibold text-gray-900">{lang.nativeName}</p>
                              <p className="text-xs text-gray-500">{lang.name}</p>
                            </div>
                          </div>
                          {currentLanguage === code && (
                            <Check className="w-5 h-5 text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowAccountMenu(!showAccountMenu)}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <div className="hidden sm:block text-right">
                        <p className="text-sm font-semibold text-gray-900">{user.displayName}</p>
                        <p className="text-xs text-gray-500">Logged in</p>
                      </div>
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full border-2 border-blue-200 shadow-md cursor-pointer"
                      />
                    </button>

                    {/* Account Menu Dropdown */}
                    {showAccountMenu && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <img 
                              src={user.photoURL} 
                              alt={user.displayName}
                              className="w-12 h-12 rounded-full border-2 border-blue-200"
                            />
                            <div className="flex-1 overflow-hidden">
                              <p className="font-bold text-gray-900 truncate">{user.displayName}</p>
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Options */}
                        <div className="py-1">
                          <button
                            onClick={switchAccount}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                          >
                            <RefreshCw className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Switch Account</span>
                          </button>

                          <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-600">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={login}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all font-semibold text-sm text-gray-700"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="hidden sm:inline">Sign in with Google</span>
                    <span className="sm:hidden">Sign in</span>
                  </button>
                )}
              </div>
            </div>

            <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </header>

        {/* Click outside to close menus */}
        {(showAccountMenu || showLanguageMenu) && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => {
              setShowAccountMenu(false);
              setShowLanguageMenu(false);
            }}
          />
        )}

        {/* Translation Loading Overlay */}
        {translating && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2">
            <Languages className="w-5 h-5 animate-spin" />
            <span className="font-semibold">Translating...</span>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
          {activeTab === "home" && <Home setActiveTab={setActiveTab} user={user} habitData={habitData} />}
          {activeTab === "today" && (
            <Today habitData={habitData} setHabitData={setHabitData} />
          )}
          {activeTab === "progress" && <Progress habitData={habitData} />}
          {activeTab === "tips" && <Tips />}
          {activeTab === "reminders" && <Reminders />}
          {activeTab === "scan" && <Scan habitData={habitData} setHabitData={setHabitData} />}
          {activeTab === "dentists" && <Dentists />}
          {activeTab === "report" && <Report habitData={habitData} />}
          {activeTab === "insights" && <Insights habitData={habitData} />}
          {activeTab === "mission" && <Mission />}
          {activeTab === "legal" && <Legal />}
        </main>

        {/* FLOATING FEEDBACK BUTTON */}
        <button
          onClick={() => setShowFeedback(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-full shadow-2xl hover:shadow-xl hover:scale-110 transition-all duration-200 group"
          title="Give Feedback"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        </button>

        {/* FEEDBACK MODAL */}
        {showFeedback && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-black text-gray-900">Share Your Feedback</h3>
                </div>
                <button
                  onClick={() => setShowFeedback(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Your feedback helps make SmileStreak better for everyone! What do you think?
              </p>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target;
                  const formData = new FormData(form);
                  
                  try {
                    const response = await fetch('https://formspree.io/f/mqedoavq', {
                      method: 'POST',
                      body: formData,
                      headers: {
                        'Accept': 'application/json'
                      }
                    });
                    
                    if (response.ok) {
                      alert('Thank you for your feedback!');
                      form.reset();
                      setShowFeedback(false);
                    } else {
                      alert('Oops! Something went wrong. Please try again.');
                    }
                  } catch (error) {
                    alert('Network error. Please check your connection and try again.');
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Your Feedback <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="feedback"
                    required
                    rows={5}
                    placeholder="What do you like? What should we improve? Any bugs?"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    How useful is SmileStreak?
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <label key={rating} className="cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-12 flex items-center justify-center border-2 border-gray-200 rounded-xl peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-blue-300 transition-all">
                          <span className="text-lg font-bold text-gray-700">
                            {rating}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">1 = Not useful, 5 = Very useful</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  Send Feedback
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                Thanks for helping us improve! 💙
              </p>
            </div>
          </div>
        )}
      </div>
    </TranslationContext.Provider>
  );
}

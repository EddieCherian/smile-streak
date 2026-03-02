import { useEffect, useState, useContext, useMemo } from "react";
import { 
  MapPin, Star, Clock, Heart, Phone, ChevronRight, TrendingUp, Award, 
  Navigation, Bookmark, X, CheckCircle2, AlertCircle, Calendar, Users,
  DollarSign, Shield, ThumbsUp, MessageCircle, Share2, Download,
  Printer, Mail, Filter, Search, Sliders, Globe, Wifi, Coffee,
  Car, Baby, Wheelchair, CreditCard, Languages, Eye, Bell,
  FileText, Activity, Smile, UserCheck, Video, Home,
  Briefcase, Sun, Moon, Zap, Target, Sparkles, Crown
} from "lucide-react";
import { TranslationContext } from "../App";

/* 🧠 Insurance intelligence profiles */
const INSURANCE_PROFILES = {
  corporate: ["Delta Dental", "Aetna", "Cigna", "MetLife", "UnitedHealthcare", "Guardian", "Humana", "BlueCross BlueShield"],
  private: ["Delta Dental", "MetLife", "Guardian", "Cigna", "Aetna"],
  medicaid: ["Medicaid", "CHIP", "Medicare"],
  ppo: ["Delta Dental PPO", "Cigna PPO", "Aetna PPO", "MetLife PPO"],
  hmo: ["Delta Dental HMO", "Cigna HMO", "Aetna HMO"],
  cash: ["Out of Network", "Self-Pay", "No Insurance"]
};

/* 🏥 Specialties */
const SPECIALTIES = [
  "General Dentistry",
  "Orthodontics",
  "Pediatric Dentistry",
  "Periodontics",
  "Endodontics",
  "Oral Surgery",
  "Cosmetic Dentistry",
  "Emergency Dentistry"
];

/* 🕒 Hours of operation templates */
const HOURS_TEMPLATES = {
  weekday: "9:00 AM - 5:00 PM",
  extended: "8:00 AM - 7:00 PM",
  saturday: "9:00 AM - 2:00 PM",
  sunday: "Closed"
};

/* 📍 Royse City coordinates for priority */
const ROYSE_CITY_COORDS = {
  lat: 32.9751,
  lng: -96.3328
};

function inferClinicType(name = "", address = "") {
  const n = name.toLowerCase();
  const a = address.toLowerCase();
  
  if (n.includes("group") || n.includes("family") || n.includes("smile") || n.includes("dental care")) {
    return "corporate";
  }
  if (n.includes("community") || n.includes("health") || n.includes("public") || a.includes("community")) {
    return "medicaid";
  }
  if (n.includes("orthodontics") || n.includes("specialty") || n.includes("surgery")) {
    return "private";
  }
  if (n.includes("cosmetic") || n.includes("aesthetic") || n.includes("spa")) {
    return "cash";
  }
  return "private";
}

function getDistanceMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI/180;
  const dLon = (lon2 - lon1) * Math.PI/180;
  const a =
    Math.sin(dLat/2) ** 2 +
    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2) ** 2;
  return (2 * R * Math.asin(Math.sqrt(a))).toFixed(1);
}

function calculateTravelTime(distance, mode = "driving") {
  const speeds = { driving: 30, walking: 3, biking: 10 };
  const hours = distance / speeds[mode];
  const minutes = Math.round(hours * 60);
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes/60)} hr ${minutes%60} min`;
}

function generateMockHours() {
  return {
    monday: Math.random() > 0.1 ? HOURS_TEMPLATES.weekday : HOURS_TEMPLATES.extended,
    tuesday: Math.random() > 0.1 ? HOURS_TEMPLATES.weekday : HOURS_TEMPLATES.extended,
    wednesday: Math.random() > 0.1 ? HOURS_TEMPLATES.weekday : HOURS_TEMPLATES.extended,
    thursday: Math.random() > 0.1 ? HOURS_TEMPLATES.weekday : HOURS_TEMPLATES.extended,
    friday: Math.random() > 0.1 ? HOURS_TEMPLATES.weekday : HOURS_TEMPLATES.extended,
    saturday: Math.random() > 0.5 ? HOURS_TEMPLATES.saturday : "Closed",
    sunday: "Closed"
  };
}

function generateMockAmenities() {
  const amenities = [];
  if (Math.random() > 0.5) amenities.push({ icon: <Wifi className="w-3 h-3" />, name: "Free WiFi" });
  if (Math.random() > 0.5) amenities.push({ icon: <Coffee className="w-3 h-3" />, name: "Coffee Bar" });
  if (Math.random() > 0.5) amenities.push({ icon: <Car className="w-3 h-3" />, name: "Free Parking" });
  if (Math.random() > 0.5) amenities.push({ icon: <Baby className="w-3 h-3" />, name: "Child-Friendly" });
  if (Math.random() > 0.5) amenities.push({ icon: <Wheelchair className="w-3 h-3" />, name: "Wheelchair Access" });
  if (Math.random() > 0.5) amenities.push({ icon: <Languages className="w-3 h-3" />, name: "Multi-lingual Staff" });
  return amenities;
}

function generateMockLanguages() {
  const languages = ["English"];
  const options = ["Spanish", "Vietnamese", "Chinese", "Korean", "Hindi", "Tagalog"];
  for (let i = 0; i < Math.floor(Math.random() * 3); i++) {
    const lang = options[Math.floor(Math.random() * options.length)];
    if (!languages.includes(lang)) languages.push(lang);
  }
  return languages;
}

export default function Dentists() {
  const { t, currentLanguage, translating } = useContext(TranslationContext);
  
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insurance, setInsurance] = useState("");
  const [sortBy, setSortBy] = useState("best");
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [translatedText, setTranslatedText] = useState({});
  
  // New state for enhanced features
  const [searchRadius, setSearchRadius] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [acceptingNewPatients, setAcceptingNewPatients] = useState(true);
  const [emergencyServices, setEmergencyServices] = useState(false);
  const [weekendHours, setWeekendHours] = useState(false);
  const [eveningHours, setEveningHours] = useState(false);
  const [priceRange, setPriceRange] = useState([1, 4]);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentNotes, setAppointmentNotes] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInsuranceDetails, setShowInsuranceDetails] = useState(false);
  const [selectedInsurancePlan, setSelectedInsurancePlan] = useState("");
  const [travelMode, setTravelMode] = useState("driving");
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [showPromotions, setShowPromotions] = useState(false);
  const [activeTab, setActiveTab] = useState("list"); // 'list', 'map', 'compare'

  // Translation keys (expanded)
  const translationKeys = {
    title: "Find Dentists",
    subtitle: "Discover top-rated dental care nearby",
    yourInsurance: "Your Insurance",
    selectInsurance: "Select your insurance",
    bestOverall: "Best Overall",
    topRated: "Top Rated",
    nearest: "Nearest",
    loading: "Finding dentists near you...",
    noDentists: "No dentists found nearby",
    expandSearch: "Try expanding your search radius",
    openNow: "Open now",
    closed: "Closed",
    milesAway: "miles away",
    likelyAccepts: "Likely accepts",
    mayNotAccept: "May not accept",
    callToConfirm: "call to confirm",
    directions: "Directions",
    appointmentPrep: "Appointment Prep",
    appointmentChecklist: "Appointment Checklist",
    beforeYouGo: "Before You Go",
    feelingNervous: "Feeling Nervous?",
    call: "Call",
    savedDentists: "Saved Dentists",
    noSavedDentists: "No saved dentists yet",
    remove: "Remove",
    recommended: "⭐ Recommended",
    topRatedBadge: "🏆 Top Rated",
    closestBadge: "📍 Closest",
    openNearby: "🟢 Open Nearby",
    
    // New features
    filters: "Filters",
    specialties: "Specialties",
    amenities: "Amenities",
    languages: "Languages",
    acceptingNewPatients: "Accepting New Patients",
    emergencyServices: "Emergency Services",
    weekendHours: "Weekend Hours",
    eveningHours: "Evening Hours",
    priceRange: "Price Range",
    applyFilters: "Apply Filters",
    clearFilters: "Clear Filters",
    compare: "Compare",
    addToCompare: "Add to Compare",
    removeFromCompare: "Remove from Compare",
    compareNow: "Compare Now",
    bookAppointment: "Book Appointment",
    requestCall: "Request Call Back",
    virtualTour: "Virtual Tour",
    promotions: "Special Offers",
    insuranceDetails: "Insurance Details",
    verified: "Verified",
    respondsQuickly: "Responds Quickly",
    yearsInPractice: "Years in Practice",
    patientsServed: "Patients Served",
    successRate: "Success Rate",
    travelTime: "Travel Time",
    saveToFavorites: "Save to Favorites",
    share: "Share",
    writeReview: "Write a Review",
    seeAllReviews: "See All Reviews",
    hoursToday: "Hours Today",
    thisWeek: "This Week",
    paymentMethods: "Payment Methods",
    financing: "Financing Available",
    parking: "Parking Info",
    accessibility: "Accessibility",
    
    appointmentTitle: "Schedule Appointment",
    selectDate: "Select Date",
    selectTime: "Select Time",
    addNotes: "Add Notes",
    confirmBooking: "Confirm Booking",
    
    reviewTitle: "Write a Review",
    yourRating: "Your Rating",
    yourReview: "Your Review",
    submitReview: "Submit Review",
    
    shareTitle: "Share This Dentist",
    shareVia: "Share via",
    copyLink: "Copy Link",
    
    insuranceTitle: "Insurance Details",
    inNetwork: "In-Network",
    outOfNetwork: "Out-of-Network",
    coverageDetails: "Coverage Details",
    
    mapView: "Map View",
    listView: "List View",
    compareView: "Compare View"
  };

  // Checklist items
  const checklistItems = [
    "Brush and floss your teeth",
    "Bring your insurance card",
    "Bring photo ID",
    "List any medications you're taking",
    "Write down questions for your dentist",
    "Arrive 15 minutes early",
    "Bring payment method",
    "Update medical history"
  ];

  // Anxiety tips
  const anxietyTips = [
    "Take deep breaths before your appointment",
    "Listen to calming music in the waiting room",
    "Tell your dentist if you're anxious",
    "Schedule morning appointments when you're fresh",
    "Bring headphones to relax",
    "Ask about sedation options"
  ];

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      const translations = {};
      for (const [key, value] of Object.entries(translationKeys)) {
        translations[key] = await t(value);
      }
      for (let i = 0; i < checklistItems.length; i++) {
        translations[`checklist_${i}`] = await t(checklistItems[i]);
      }
      for (let i = 0; i < anxietyTips.length; i++) {
        translations[`anxietyTip_${i}`] = await t(anxietyTips[i]);
      }
      setTranslatedText(translations);
    };
    loadTranslations();
  }, [currentLanguage, t]);

  // Load favorites
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favoriteDentists') || '[]');
    setFavorites(saved);
  }, []);

  // Save favorites
  const toggleFavorite = (dentist) => {
    const isFavorited = favorites.some(f => f.id === dentist.id);
    let updated;
    if (isFavorited) {
      updated = favorites.filter(f => f.id !== dentist.id);
    } else {
      updated = [...favorites, dentist];
    }
    setFavorites(updated);
    localStorage.setItem('favoriteDentists', JSON.stringify(updated));
  };

  const isFavorite = (dentistId) => favorites.some(f => f.id === dentistId);

  // Toggle compare selection
  const toggleCompare = (dentist) => {
    if (selectedForCompare.some(d => d.id === dentist.id)) {
      setSelectedForCompare(selectedForCompare.filter(d => d.id !== dentist.id));
    } else {
      if (selectedForCompare.length < 3) {
        setSelectedForCompare([...selectedForCompare, dentist]);
      } else {
        alert("You can compare up to 3 dentists at a time");
      }
    }
  };

  // Fetch dentists
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setUserLocation({ latitude, longitude });
      setMapCenter({ latitude, longitude });

      try {
        const res = await fetch(
          "https://places.googleapis.com/v1/places:searchNearby",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAPS_KEY,
              "X-Goog-FieldMask":
                "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours,places.reviews,places.nationalPhoneNumber,places.websiteUri,places.regularOpeningHours,places.priceLevel",
            },
            body: JSON.stringify({
              includedTypes: ["dentist"],
              maxResultCount: 20,
              locationRestriction: {
                circle: {
                  center: { latitude, longitude },
                  radius: searchRadius * 1609.34, // Convert miles to meters
                },
              },
            }),
          }
        );

        if (!res.ok) throw new Error("Google Places request failed");

        const json = await res.json();
        const data = json.places || [];

        const enriched = data.map((d) => {
          const lat = d.location?.latitude;
          const lng = d.location?.longitude;
          const distance = lat && lng ? getDistanceMiles(latitude, longitude, lat, lng) : null;
          const isRoyseCity = d.displayName?.text?.toLowerCase().includes("royse city dental care");

          return {
            id: d.id,
            name: d.displayName?.text,
            address: d.formattedAddress,
            rating: d.rating,
            review_count: d.userRatingCount,
            lat,
            lng,
            review: d.reviews?.[0]?.text?.text || d.reviews?.[0]?.originalText?.text || null,
            openNow: d.currentOpeningHours?.openNow,
            phone: d.nationalPhoneNumber,
            website: d.websiteUri,
            mapsLink: `https://www.google.com/maps/place/?q=place_id:${d.id}`,
            distance: parseFloat(distance),
            travelTime: distance ? calculateTravelTime(distance, travelMode) : null,
            priceLevel: d.priceLevel || 2,
            hours: generateMockHours(),
            amenities: generateMockAmenities(),
            languages: generateMockLanguages(),
            specialties: isRoyseCity ? ["General Dentistry", "Cosmetic Dentistry", "Emergency"] : SPECIALTIES.slice(0, Math.floor(Math.random() * 4) + 1),
            yearsInPractice: Math.floor(Math.random() * 25) + 5,
            patientsServed: Math.floor(Math.random() * 5000) + 1000,
            successRate: Math.floor(Math.random() * 20) + 80,
            verified: Math.random() > 0.2,
            respondsQuickly: Math.random() > 0.3,
            acceptingNew: Math.random() > 0.1,
            emergencyAvailable: Math.random() > 0.4,
            paymentMethods: ["Visa", "Mastercard", "Amex", "Cash", "Check"].slice(0, Math.floor(Math.random() * 4) + 2),
            financing: Math.random() > 0.5,
            parkingInfo: Math.random() > 0.3 ? "Free parking available" : "Street parking",
            isRoyseCity
          };
        });

        setDentists(enriched);
      } catch (err) {
        console.error("Dentist fetch failed:", err);
        setDentists([]);
      } finally {
        setLoading(false);
      }
    });
  }, [searchRadius, travelMode]);

  // Filter dentists based on selected criteria
  const filteredDentists = useMemo(() => {
    return dentists.filter(d => {
      // Filter by search query
      if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by specialties
      if (selectedSpecialties.length > 0) {
        if (!d.specialties?.some(s => selectedSpecialties.includes(s))) {
          return false;
        }
      }
      
      // Filter by accepting new patients
      if (acceptingNewPatients && !d.acceptingNew) {
        return false;
      }
      
      // Filter by emergency services
      if (emergencyServices && !d.emergencyAvailable) {
        return false;
      }
      
      // Filter by weekend hours
      if (weekendHours && d.hours.saturday === "Closed") {
        return false;
      }
      
      // Filter by price range
      if (d.priceLevel < priceRange[0] || d.priceLevel > priceRange[1]) {
        return false;
      }
      
      return true;
    });
  }, [dentists, searchQuery, selectedSpecialties, acceptingNewPatients, emergencyServices, weekendHours, priceRange]);

  // Smart sorting with Royse City priority
  const getSortedDentists = () => {
    let sorted = [...filteredDentists];

    if (sortBy === "best") {
      // Always put Royse City first if it exists
      const royseCityIndex = sorted.findIndex(d => d.isRoyseCity);
      if (royseCityIndex !== -1) {
        const royseCityDental = sorted.splice(royseCityIndex, 1)[0];
        sorted.unshift(royseCityDental);
      }

      const rest = sorted.slice(1).sort((a, b) => {
        const scoreA = (a.rating || 0) * 10 - (a.distance || 99);
        const scoreB = (b.rating || 0) * 10 - (b.distance || 99);
        return scoreB - scoreA;
      });

      return royseCityIndex !== -1 ? [sorted[0], ...rest] : rest;
    }

    if (sortBy === "rating") {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "distance") {
      sorted.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    }

    return sorted;
  };

  const sortedDentists = getSortedDentists();

  // Badge logic
  const getBadge = (dentist, index) => {
    if (dentist.isRoyseCity && sortBy === "best") {
      return { text: "⭐ Royse City Dental Care", color: "bg-gradient-to-r from-yellow-400 to-orange-400 text-white" };
    }
    if (index === 0 && sortBy === "rating") {
      return { text: "🏆 Top Rated", color: "bg-yellow-100 text-yellow-700" };
    }
    if (index === 0 && sortBy === "distance") {
      return { text: "📍 Closest", color: "bg-blue-100 text-blue-700" };
    }
    if (dentist.openNow && dentist.distance < 5) {
      return { text: "🟢 Open Nearby", color: "bg-green-100 text-green-700" };
    }
    if (dentist.verified) {
      return { text: "✅ Verified", color: "bg-blue-100 text-blue-700" };
    }
    if (dentist.emergencyAvailable) {
      return { text: "🚑 Emergency", color: "bg-red-100 text-red-700" };
    }
    return null;
  };

  if (translating || Object.keys(translatedText).length === 0) {
    return (
      <section className="space-y-6 pb-8">
        <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl">
          <div className="animate-pulse flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            <h2 className="text-2xl font-black">Loading...</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 pb-8">
      {/* Header with Quick Actions */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-6 h-6" />
                <h2 className="text-2xl font-black">{translatedText.title}</h2>
              </div>
              <p className="text-sm opacity-90">{translatedText.subtitle}</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('list')}
                className={`p-2 rounded-xl transition-colors ${activeTab === 'list' ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'}`}
                title="List View"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`p-2 rounded-xl transition-colors ${activeTab === 'map' ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'}`}
                title="Map View"
              >
                <MapPin className="w-5 h-5" />
              </button>
              {selectedForCompare.length > 0 && (
                <button
                  onClick={() => setShowCompare(true)}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-2 hover:bg-white/30 transition-colors relative"
                  title="Compare"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-xs flex items-center justify-center">
                    {selectedForCompare.length}
                  </span>
                </button>
              )}
              {favorites.length > 0 && (
                <button
                  onClick={() => setShowFavorites(true)}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-2 hover:bg-white/30 transition-colors relative"
                  title="Favorites"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    {favorites.length}
                  </span>
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-xl transition-colors ${showFilters ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'}`}
                title="Filters"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or specialty..."
              className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:bg-white/30 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100 animate-[slideDown_0.3s_ease-out]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-600" />
              {translatedText.filters}
            </h3>
            <button
              onClick={() => {
                setSelectedSpecialties([]);
                setAcceptingNewPatients(false);
                setEmergencyServices(false);
                setWeekendHours(false);
                setEveningHours(false);
                setPriceRange([1, 4]);
                setSearchRadius(10);
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-4">
            {/* Radius Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Radius: {searchRadius} miles
              </label>
              <input
                type="range"
                min="1"
                max="25"
                value={searchRadius}
                onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Specialties */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translatedText.specialties}
              </label>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map(specialty => (
                  <button
                    key={specialty}
                    onClick={() => {
                      if (selectedSpecialties.includes(specialty)) {
                        setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialty));
                      } else {
                        setSelectedSpecialties([...selectedSpecialties, specialty]);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      selectedSpecialties.includes(specialty)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Filters */}
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptingNewPatients}
                  onChange={(e) => setAcceptingNewPatients(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">{translatedText.acceptingNewPatients}</span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={emergencyServices}
                  onChange={(e) => setEmergencyServices(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">{translatedText.emergencyServices}</span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={weekendHours}
                  onChange={(e) => setWeekendHours(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">{translatedText.weekendHours}</span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={eveningHours}
                  onChange={(e) => setEveningHours(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">{translatedText.eveningHours}</span>
              </label>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translatedText.priceRange} ($ - $$$$)
              </label>
              <div className="flex gap-4">
                <select
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="flex-1 p-2 rounded-xl border-2 border-gray-200"
                >
                  <option value="1">$</option>
                  <option value="2">$$</option>
                  <option value="3">$$$</option>
                  <option value="4">$$$$</option>
                </select>
                <span className="text-gray-400">to</span>
                <select
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="flex-1 p-2 rounded-xl border-2 border-gray-200"
                >
                  <option value="1">$</option>
                  <option value="2">$$</option>
                  <option value="3">$$$</option>
                  <option value="4">$$$$</option>
                </select>
              </div>
            </div>

            {/* Travel Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Mode
              </label>
              <div className="flex gap-2">
                {[
                  { mode: "driving", icon: <Car className="w-4 h-4" />, label: "Driving" },
                  { mode: "walking", icon: <User className="w-4 h-4" />, label: "Walking" },
                  { mode: "biking", icon: <Activity className="w-4 h-4" />, label: "Biking" }
                ].map(option => (
                  <button
                    key={option.mode}
                    onClick={() => setTravelMode(option.mode)}
                    className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-semibold transition-colors ${
                      travelMode === option.mode
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insurance Selector */}
      <div className="bg-white rounded-2xl p-4 shadow-md border border-blue-100">
        <label className="block text-sm font-semibold text-gray-700 mb-2">{translatedText.yourInsurance}</label>
        <select
          value={insurance}
          onChange={(e) => setInsurance(e.target.value)}
          className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none font-medium"
        >
          <option value="">{translatedText.selectInsurance}</option>
          <option>Delta Dental</option>
          <option>Aetna</option>
          <option>Cigna</option>
          <option>MetLife</option>
          <option>UnitedHealthcare</option>
          <option>Guardian</option>
          <option>Humana</option>
          <option>Medicaid</option>
          <option>Medicare</option>
          <option>Out of Network</option>
        </select>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'best', label: translatedText.bestOverall, icon: <Award className="w-4 h-4" /> },
          { id: 'rating', label: translatedText.topRated, icon: <Star className="w-4 h-4" /> },
          { id: 'distance', label: translatedText.nearest, icon: <Navigation className="w-4 h-4" /> }
        ].map(sort => (
          <button
            key={sort.id}
            onClick={() => setSortBy(sort.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
              sortBy === sort.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
            }`}
          >
            {sort.icon}
            {sort.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Found {filteredDentists.length} dentists
        </p>
        {selectedForCompare.length > 0 && (
          <button
            onClick={() => setShowCompare(true)}
            className="text-sm text-blue-600 font-semibold hover:text-blue-700"
          >
            Compare {selectedForCompare.length} selected
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">{translatedText.loading}</p>
        </div>
      )}

      {/* No Results */}
      {!loading && filteredDentists.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">{translatedText.noDentists}</p>
          <p className="text-sm text-gray-500 mt-1">{translatedText.expandSearch}</p>
        </div>
      )}

      {/* Map View */}
      {activeTab === 'map' && !loading && filteredDentists.length > 0 && (
        <div className="h-96 bg-gray-100 rounded-3xl overflow-hidden relative">
          {/* This would be replaced with actual Google Maps integration */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <p className="text-gray-600">Map view would display {filteredDentists.length} dentists</p>
          </div>
        </div>
      )}

      {/* List View */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {sortedDentists.map((d, index) => {
            const clinicType = inferClinicType(d.name, d.address);
            const likelyPlans = INSURANCE_PROFILES[clinicType] || [];
            const likelyAccepted = insurance && likelyPlans.includes(insurance);
            const badge = getBadge(d, index);
            const isInCompare = selectedForCompare.some(s => s.id === d.id);

            return (
              <div
                key={d.id}
                className={`group bg-white rounded-3xl p-5 shadow-md border-2 transition-all duration-200 ${
                  isInCompare ? 'border-blue-400' : 'border-gray-200 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Header with Badges */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-gray-900 text-lg">{d.name}</h3>
                      {d.verified && (
                        <span className="text-blue-600" title="Verified">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {badge && (
                        <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${badge.color}`}>
                          {badge.text}
                        </span>
                      )}
                      {d.emergencyAvailable && (
                        <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-700">
                          🚑 Emergency
                        </span>
                      )}
                      {d.respondsQuickly && (
                        <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">
                          ⚡ Responds Quickly
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleCompare(d)}
                      className={`p-2 rounded-xl transition-colors ${
                        isInCompare ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-400'
                      }`}
                      title="Compare"
                    >
                      <BarChart3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleFavorite(d)}
                      className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isFavorite(d.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Rating & Status */}
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  {d.rating && (
                    <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-gray-900">{d.rating}</span>
                      <span className="text-xs text-gray-500">({d.review_count})</span>
                    </div>
                  )}
                  
                  {d.openNow !== undefined && (
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                      d.openNow ? 'bg-green-50' : 'bg-gray-100'
                    }`}>
                      <Clock className={`w-4 h-4 ${d.openNow ? 'text-green-600' : 'text-gray-500'}`} />
                      <span className={`text-xs font-semibold ${d.openNow ? 'text-green-700' : 'text-gray-600'}`}>
                        {d.openNow ? translatedText.openNow : translatedText.closed}
                      </span>
                    </div>
                  )}

                  {d.priceLevel && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-50">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-semibold text-purple-700">
                        {'$'.repeat(d.priceLevel)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Address & Distance */}
                {d.address && (
                  <p className="text-sm text-gray-600 mb-2 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    {d.address}
                  </p>
                )}

                <div className="flex gap-4 mb-3">
                  {d.distance && (
                    <p className="text-sm font-semibold text-blue-600">
                      📍 {d.distance} {translatedText.milesAway}
                    </p>
                  )}
                  {d.travelTime && (
                    <p className="text-sm text-gray-600">
                      🕐 {d.travelTime} by {travelMode}
                    </p>
                  )}
                </div>

                {/* Specialties */}
                {d.specialties && d.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {d.specialties.map(specialty => (
                      <span key={specialty} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}

                {/* Amenities */}
                {d.amenities && d.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {d.amenities.map((amenity, i) => (
                      <span key={i} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                        {amenity.icon}
                        {amenity.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Languages */}
                {d.languages && d.languages.length > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <p className="text-xs text-gray-600">
                      {d.languages.join(' • ')}
                    </p>
                  </div>
                )}

                {/* Review */}
                {d.review && (
                  <div className="bg-gray-50 rounded-xl p-3 mb-3">
                    <p className="text-xs text-gray-600 italic line-clamp-2">"{d.review}"</p>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 bg-blue-50 rounded-xl">
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="text-sm font-bold text-gray-900">{d.yearsInPractice} yrs</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-xl">
                    <p className="text-xs text-gray-500">Patients</p>
                    <p className="text-sm font-bold text-gray-900">{d.patientsServed}+</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded-xl">
                    <p className="text-xs text-gray-500">Success</p>
                    <p className="text-sm font-bold text-gray-900">{d.successRate}%</p>
                  </div>
                </div>

                {/* Insurance */}
                {insurance && (
                  <div className={`flex items-start gap-2 p-3 rounded-xl mb-3 ${
                    likelyAccepted ? 'bg-green-50' : 'bg-orange-50'
                  }`}>
                    {likelyAccepted ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`text-xs font-medium ${
                      likelyAccepted ? 'text-green-700' : 'text-orange-700'
                    }`}>
                      {likelyAccepted
                        ? `${translatedText.likelyAccepts} ${insurance}`
                        : `${translatedText.mayNotAccept} ${insurance} — ${translatedText.callToConfirm}`}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  <a
                    href={d.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 bg-blue-500 text-white py-2 rounded-xl text-xs font-semibold hover:bg-blue-600 transition-colors"
                    title="Directions"
                  >
                    <MapPin className="w-3 h-3" />
                    <span className="hidden sm:inline">Directions</span>
                  </a>
                  
                  {d.phone && (
                    <a
                      href={`tel:${d.phone}`}
                      className="flex items-center justify-center gap-1 bg-green-500 text-white py-2 rounded-xl text-xs font-semibold hover:bg-green-600 transition-colors"
                      title="Call"
                    >
                      <Phone className="w-3 h-3" />
                      <span className="hidden sm:inline">Call</span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      setSelectedDentist(d);
                      setShowAppointmentModal(true);
                    }}
                    className="flex items-center justify-center gap-1 bg-purple-500 text-white py-2 rounded-xl text-xs font-semibold hover:bg-purple-600 transition-colors"
                    title="Book"
                  >
                    <Calendar className="w-3 h-3" />
                    <span className="hidden sm:inline">Book</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedDentist(d);
                      setShowAppointmentModal(true);
                    }}
                    className="flex items-center justify-center gap-1 bg-white border-2 border-gray-200 text-gray-900 py-2 rounded-xl text-xs font-semibold hover:border-blue-300 transition-colors"
                    title="More"
                  >
                    <ChevronRight className="w-3 h-3" />
                    <span className="hidden sm:inline">More</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Appointment Modal */}
      {showAppointmentModal && selectedDentist && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-gray-900">{translatedText.appointmentTitle}</h3>
              <button onClick={() => setShowAppointmentModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">{selectedDentist.name}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {translatedText.selectDate}
                </label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {translatedText.selectTime}
                </label>
                <select
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none"
                >
                  <option value="">Select time</option>
                  <option value="9:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {translatedText.addNotes}
                </label>
                <textarea
                  value={appointmentNotes}
                  onChange={(e) => setAppointmentNotes(e.target.value)}
                  rows={3}
                  placeholder="Reason for visit, questions, etc."
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none resize-none"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">{translatedText.beforeYouGo}</h4>
                <ul className="space-y-1">
                  {checklistItems.slice(0, 4).map((_, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      {translatedText[`checklist_${i}`]}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  alert(`Appointment requested with ${selectedDentist.name} on ${appointmentDate} at ${appointmentTime}`);
                  setShowAppointmentModal(false);
                  setAppointmentDate("");
                  setAppointmentTime("");
                  setAppointmentNotes("");
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                {translatedText.confirmBooking}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompare && selectedForCompare.length > 0 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Compare Dentists
              </h3>
              <button onClick={() => setShowCompare(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {selectedForCompare.map(dentist => (
                <div key={dentist.id} className="space-y-3">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <span className="text-4xl">🦷</span>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-gray-900 text-sm">{dentist.name}</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Rating</span>
                      <span className="font-semibold">{dentist.rating || 'N/A'} ⭐</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Distance</span>
                      <span className="font-semibold">{dentist.distance} mi</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Price</span>
                      <span className="font-semibold">{'$'.repeat(dentist.priceLevel || 2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Experience</span>
                      <span className="font-semibold">{dentist.yearsInPractice} yrs</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Open Now</span>
                      <span className={dentist.openNow ? 'text-green-600' : 'text-red-600'}>
                        {dentist.openNow ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedForCompare(selectedForCompare.filter(d => d.id !== dentist.id));
                    }}
                    className="w-full py-2 text-xs text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Favorites Modal */}
      {showFavorites && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-hidden animate-[scaleBounce_0.3s_ease-out]">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <h3 className="font-black text-gray-900">{translatedText.savedDentists}</h3>
              </div>
              <button onClick={() => setShowFavorites(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3">
              {favorites.length === 0 ? (
                <p className="text-center text-gray-500 py-8">{translatedText.noSavedDentists}</p>
              ) : (
                favorites.map((d) => (
                  <div key={d.id} className="flex gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-1">{d.name}</p>
                      <p className="text-xs text-gray-600 mb-2">{d.address}</p>
                      <div className="flex gap-2">
                        <a
                          href={d.mapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {translatedText.directions}
                        </a>
                        <button
                          onClick={() => {
                            toggleFavorite(d);
                            if (favorites.length === 1) setShowFavorites(false);
                          }}
                          className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          {translatedText.remove}
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
    </section>
  );
}
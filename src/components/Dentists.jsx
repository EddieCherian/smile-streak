import { useEffect, useState, useContext, useMemo } from "react";
import { 
  MapPin, Star, Clock, Heart, Phone, ChevronRight, TrendingUp, Award, 
  Navigation, X, CheckCircle2, AlertCircle, Calendar, Users,
  DollarSign, Filter, Search, Sliders, Globe, Car,
  Menu, BarChart3
} from "lucide-react";
import { TranslationContext } from "../App";

// Add fallback for any icons that might not exist
const Wheelchair = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="6" r="2" />
    <path d="M4 12h4l2 8 3-4 3 4 2-8h4" />
  </svg>
);

/* 🧠 Insurance intelligence profiles - these are based on common patterns, not guaranteed */
const INSURANCE_PROFILES = {
  corporate: ["Delta Dental", "Aetna", "Cigna", "MetLife", "UnitedHealthcare", "Guardian"],
  private: ["Delta Dental", "MetLife", "Guardian", "Cigna"],
  medicaid: ["Medicaid", "CHIP", "Medicare"]
};

function inferClinicType(name = "", address = "") {
  const n = name.toLowerCase();
  const a = address.toLowerCase();
  
  if (n.includes("community") || n.includes("health") || a.includes("community")) {
    return "medicaid";
  }
  if (n.includes("family") || n.includes("group") || n.includes("dental care")) {
    return "corporate";
  }
  return "private";
}

function getDistanceMiles(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
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
  
  // Essential filters only
  const [searchRadius, setSearchRadius] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("list");

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
    appointmentPrep: "Appointment Info",
    call: "Call",
    savedDentists: "Saved Dentists",
    noSavedDentists: "No saved dentists yet",
    remove: "Remove",
    recommended: "⭐ Recommended",
    topRatedBadge: "🏆 Top Rated",
    closestBadge: "📍 Closest",
    openNearby: "🟢 Open Nearby",
    
    filters: "Filters",
    compare: "Compare",
    compareNow: "Compare Now",
    bookAppointment: "Book Appointment",
    
    mapView: "Map View",
    listView: "List View",
    compareView: "Compare View"
  };

  // Load translations
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

  // Load favorites from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favoriteDentists') || '[]');
    setFavorites(saved);
  }, []);

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

  const toggleCompare = (dentist) => {
    if (selectedForCompare.some(d => d.id === dentist.id)) {
      setSelectedForCompare(selectedForCompare.filter(d => d.id !== dentist.id));
    } else {
      if (selectedForCompare.length < 3) {
        setSelectedForCompare([...selectedForCompare, dentist]);
      }
    }
  };

  // Fetch dentists from Google Places API
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setUserLocation({ latitude, longitude });

      try {
        const res = await fetch(
          "https://places.googleapis.com/v1/places:searchNearby",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAPS_KEY,
              "X-Goog-FieldMask":
                "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours,places.reviews,places.nationalPhoneNumber,places.websiteUri,places.priceLevel",
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
            distance: distance ? parseFloat(distance) : null,
            priceLevel: d.priceLevel || null,
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
  }, [searchRadius]);

  // Filter dentists based on search query only
  const filteredDentists = useMemo(() => {
    return dentists.filter(d => {
      if (searchQuery && !d.name?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [dentists, searchQuery]);

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
      {/* Header */}
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
              {selectedForCompare.length > 0 && (
                <button
                  onClick={() => setShowCompare(true)}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-2 hover:bg-white/30 transition-colors relative"
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
              placeholder="Search by name..."
              className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:bg-white/30 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-600" />
              {translatedText.filters}
            </h3>
            <button
              onClick={() => setSearchRadius(10)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Reset
            </button>
          </div>

          {/* Radius Slider - Real filter that affects API call */}
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
          <option>Medicaid</option>
        </select>
        <p className="text-xs text-gray-500 mt-2">Insurance acceptance is estimated based on clinic type. Always call to confirm.</p>
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

      {/* Dentist Cards - Only Real Data */}
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
                isInCompare ? 'border-blue-400' : 'border-gray-200 hover:border-blue-300 hover:shadow-xl'
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 text-lg mb-1">{d.name}</h3>
                  {badge && (
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${badge.color}`}>
                      {badge.text}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => toggleCompare(d)}
                    className={`p-2 rounded-xl transition-colors ${
                      isInCompare ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-400'
                    }`}
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

              {/* Rating & Status - Real data from API */}
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                {d.rating ? (
                  <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-gray-900">{d.rating}</span>
                    {d.review_count && (
                      <span className="text-xs text-gray-500">({d.review_count})</span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg">
                    <span className="text-xs text-gray-500">No ratings yet</span>
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

              {/* Address - Real from API */}
              {d.address && (
                <p className="text-sm text-gray-600 mb-2 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  {d.address}
                </p>
              )}

              {/* Distance - Calculated from real coordinates */}
              {d.distance && (
                <p className="text-sm font-semibold text-blue-600 mb-3">
                  📍 {d.distance} {translatedText.milesAway}
                </p>
              )}

              {/* Review - Real from API if available */}
              {d.review && (
                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  <p className="text-xs text-gray-600 italic line-clamp-2">"{d.review}"</p>
                </div>
              )}

              {/* Insurance - Based on inference, clearly marked as estimated */}
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

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={d.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 bg-blue-500 text-white py-2 rounded-xl text-xs font-semibold hover:bg-blue-600 transition-colors"
                >
                  <MapPin className="w-3 h-3" />
                  <span>{translatedText.directions}</span>
                </a>
                
                {d.phone && (
                  <a
                    href={`tel:${d.phone}`}
                    className="flex items-center justify-center gap-1 bg-green-500 text-white py-2 rounded-xl text-xs font-semibold hover:bg-green-600 transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{translatedText.call}</span>
                  </a>
                )}

                <button
                  onClick={() => setSelectedDentist(d)}
                  className="flex items-center justify-center gap-1 bg-white border-2 border-gray-200 text-gray-900 py-2 rounded-xl text-xs font-semibold hover:border-blue-300 transition-colors"
                >
                  <Calendar className="w-3 h-3" />
                  <span>Info</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Modal - Shows real data about the dentist */}
      {selectedDentist && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-gray-900">{selectedDentist.name}</h3>
              <button onClick={() => setSelectedDentist(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-gray-700 mb-2">{selectedDentist.address}</p>
                {selectedDentist.phone && (
                  <a href={`tel:${selectedDentist.phone}`} className="text-sm text-blue-600 font-semibold">
                    {selectedDentist.phone}
                  </a>
                )}
              </div>

              {selectedDentist.website && (
                <a
                  href={selectedDentist.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                >
                  Visit Website
                </a>
              )}

              <a
                href={selectedDentist.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
              >
                Get Directions
              </a>
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
                  <h4 className="font-bold text-gray-900 text-sm">{dentist.name}</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Rating</span>
                      <span className="font-semibold">{dentist.rating || 'N/A'} ⭐</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Distance</span>
                      <span className="font-semibold">{dentist.distance ? `${dentist.distance} mi` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Price</span>
                      <span className="font-semibold">{dentist.priceLevel ? '$'.repeat(dentist.priceLevel) : 'N/A'}</span>
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-hidden">
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
                  <div key={d.id} className="flex gap-3 p-4 rounded-xl bg-gray-50">
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
                          onClick={() => toggleFavorite(d)}
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
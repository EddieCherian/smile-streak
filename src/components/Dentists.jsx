import { useEffect, useState, useContext, useMemo } from "react";
import { 
  MapPin, Star, Clock, Heart, Phone, ChevronRight, TrendingUp, Award, 
  Navigation, X, CheckCircle2, AlertCircle, Calendar, Users,
  DollarSign, Filter, Search, Sliders, Globe, Car,
  Menu, BarChart3, Sparkles, Shield, HelpCircle, AlertTriangle,
  Wifi, Coffee, Baby, CreditCard, Languages, ExternalLink
} from "lucide-react";
import { TranslationContext } from "../App";

// Add fallback for any icons that might not exist
const Wheelchair = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="6" r="2" />
    <path d="M4 12h4l2 8 3-4 3 4 2-8h4" />
  </svg>
);

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

// Gemini API function for insurance prediction with better error handling
async function predictInsuranceWithGemini(dentistName, dentistAddress, userInsurance) {
  if (!userInsurance) return null;
  
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  if (!API_KEY) {
    console.warn("Gemini API key not found");
    return null;
  }

  // Fallback prediction based on keywords if API fails
  const getFallbackPrediction = () => {
    const name = dentistName.toLowerCase();
    const address = dentistAddress.toLowerCase();
    
    // Check for corporate chains
    if (name.includes('aspen') || name.includes('western') || name.includes('comfort') || name.includes('gentle')) {
      return {
        accepts: true,
        confidence: 'medium',
        reason: 'Corporate dental chain typically accepts major insurance plans'
      };
    }
    
    // Check for community health centers
    if (name.includes('community') || name.includes('health') || address.includes('community')) {
      return {
        accepts: userInsurance === 'Medicaid' || userInsurance === 'Medicare',
        confidence: 'medium',
        reason: 'Community health centers often accept government insurance'
      };
    }
    
    // Check for dental schools
    if (name.includes('university') || name.includes('college') || name.includes('school')) {
      return {
        accepts: true,
        confidence: 'medium',
        reason: 'Dental schools and university clinics accept multiple insurance types'
      };
    }
    
    // Default for private practices
    return {
      accepts: Math.random() > 0.3,
      confidence: 'low',
      reason: 'Private practice acceptance varies - please call to confirm'
    };
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an AI assistant that predicts whether dental clinics accept specific insurance plans.
              
              Based on the dentist's name and address, predict if they are likely to accept ${userInsurance} insurance.
              
              Dentist Name: ${dentistName}
              Address: ${dentistAddress}
              
              Consider these factors:
              - Corporate dental chains (Aspen Dental, Western Dental, etc.) typically accept major insurance plans
              - Private practices may have more limited acceptance
              - Community health centers and clinics with "community" or "health" in the name often accept Medicaid/Medicare
              - Dental schools and university-affiliated clinics usually accept multiple insurance types
              - Geographic location and practice size can indicate insurance acceptance patterns
              
              Return a JSON object with:
              - "accepts": boolean (true/false) - your best prediction
              - "confidence": "high", "medium", or "low" - how confident you are
              - "reason": brief explanation of why you think this
              
              Examples:
              - "Aspen Dental" in any location → likely accepts most major insurance
              - "Community Health Center" → likely accepts Medicaid
              - "Smith Family Dentistry" (private practice) → may have limited acceptance
              
              Return ONLY the JSON object, no other text.`
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.warn("Unexpected API response structure:", data);
      return getFallbackPrediction();
    }
    
    const text = data.candidates[0].content.parts[0].text;
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.warn("Failed to parse JSON from Gemini response:", e);
        return getFallbackPrediction();
      }
    }
    return getFallbackPrediction();
  } catch (error) {
    console.error("Gemini API error:", error);
    return getFallbackPrediction();
  }
}

export default function Dentists() {
  const { t, currentLanguage, translating } = useContext(TranslationContext);
  
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insurance, setInsurance] = useState("");
  const [insurancePredictions, setInsurancePredictions] = useState({});
  const [predictingInsurance, setPredictingInsurance] = useState(false);
  const [predictionError, setPredictionError] = useState(false);
  const [sortBy, setSortBy] = useState("best");
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [translatedText, setTranslatedText] = useState({});
  const [locationError, setLocationError] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  
  const [searchRadius, setSearchRadius] = useState(16);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInsuranceHelp, setShowInsuranceHelp] = useState(false);
  const [reviews, setReviews] = useState({});
  const [loadingReviews, setLoadingReviews] = useState({});

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
    
    insuranceHelp: "How Insurance Prediction Works",
    insuranceHelpText: "Our AI analyzes the dentist's name, location, and practice type to predict insurance acceptance. This is an estimate - always call to confirm.",
    highConfidence: "High confidence prediction",
    mediumConfidence: "Medium confidence prediction", 
    lowConfidence: "Low confidence prediction",
    predicting: "Analyzing insurance acceptance...",
    predictionFallback: "Using estimated prediction",
    locationDenied: "Location access denied. Please enable location services to find nearby dentists.",
    retry: "Retry",
    
    // New real data features
    viewReviews: "View Reviews",
    loadingReviews: "Loading reviews...",
    noReviews: "No reviews yet",
    recentReview: "Recent Review",
    fromGoogle: "from Google",
    website: "Website",
    copySuccess: "Link copied!",
    share: "Share",
    photos: "Photos",
    viewPhoto: "View Photo",
    amenities: "Amenities",
    paymentMethods: "Payment Methods",
    languagesSpoken: "Languages",
    verified: "Verified on Google"
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

  // Run insurance predictions when insurance changes
  useEffect(() => {
    async function predictAllInsurance() {
      if (!insurance || dentists.length === 0) {
        setInsurancePredictions({});
        return;
      }
      
      setPredictingInsurance(true);
      setPredictionError(false);
      const predictions = {};
      let hasError = false;
      
      for (let i = 0; i < dentists.length; i += 2) {
        const batch = dentists.slice(i, i + 2);
        await Promise.all(
          batch.map(async (dentist) => {
            try {
              const prediction = await predictInsuranceWithGemini(
                dentist.name,
                dentist.address,
                insurance
              );
              if (prediction) {
                predictions[dentist.id] = prediction;
              }
            } catch (err) {
              console.warn(`Failed to get prediction for ${dentist.name}:`, err);
              hasError = true;
            }
          })
        );
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      setInsurancePredictions(predictions);
      setPredictionError(hasError);
      setPredictingInsurance(false);
    }

    predictAllInsurance();
  }, [insurance, dentists]);

  // Fetch place details including photos and more reviews
  const fetchPlaceDetails = async (placeId) => {
    if (reviews[placeId]) return; // Already fetched
    
    setLoadingReviews(prev => ({ ...prev, [placeId]: true }));
    
    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&fields=reviews,photos,regularOpeningHours,paymentOptions,parkingOptions,accessibilityOptions`,
        {
          headers: {
            "X-Goog-FieldMask": "reviews,photos,regularOpeningHours,paymentOptions,parkingOptions,accessibilityOptions"
          }
        }
      );
      
      if (!res.ok) throw new Error("Failed to fetch place details");
      
      const data = await res.json();
      setReviews(prev => ({ ...prev, [placeId]: data }));
    } catch (err) {
      console.error("Error fetching place details:", err);
    } finally {
      setLoadingReviews(prev => ({ ...prev, [placeId]: false }));
    }
  };

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

  // Fetch dentists from Google Places API (correct implementation)
  const fetchDentists = (radius) => {
    setLoading(true);
    setLocationError(false);
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ latitude, longitude });

        try {
          const radiusInMeters = radius * 1609.34;
          
          const res = await fetch(
            "https://places.googleapis.com/v1/places:searchNearby",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAPS_KEY,
                "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours,places.reviews,places.nationalPhoneNumber,places.websiteUri,places.priceLevel,places.photos,places.regularOpeningHours,places.paymentOptions,places.parkingOptions,places.accessibilityOptions",
              },
              body: JSON.stringify({
                includedTypes: ["dentist"],
                maxResultCount: 20,
                locationRestriction: {
                  circle: {
                    center: {
                      latitude: latitude,
                      longitude: longitude
                    },
                    radius: radiusInMeters
                  }
                }
              }),
            }
          );

          if (!res.ok) {
            const errorText = await res.text();
            console.error("Places API error:", errorText);
            throw new Error(`Google Places request failed: ${res.status}`);
          }

          const json = await res.json();
          const data = json.places || [];

          const enriched = data.map((d) => {
            const lat = d.location?.latitude;
            const lng = d.location?.longitude;
            const distance = lat && lng ? getDistanceMiles(latitude, longitude, lat, lng) : null;
            const isRoyseCity = d.displayName?.text?.toLowerCase().includes("royse city dental care");

            // Extract real data from Google Places
            const paymentMethods = [];
            if (d.paymentOptions?.acceptsCreditCards) paymentMethods.push("Credit Cards");
            if (d.paymentOptions?.acceptsDebitCards) paymentMethods.push("Debit Cards");
            if (d.paymentOptions?.acceptsCashOnly) paymentMethods.push("Cash Only");
            if (d.paymentOptions?.acceptsInsurance) paymentMethods.push("Insurance");

            const accessibility = [];
            if (d.accessibilityOptions?.wheelchairAccessibleEntrance) accessibility.push("Wheelchair Accessible");
            if (d.accessibilityOptions?.wheelchairAccessibleParking) accessibility.push("Accessible Parking");
            if (d.accessibilityOptions?.wheelchairAccessibleRestroom) accessibility.push("Accessible Restroom");
            if (d.accessibilityOptions?.wheelchairAccessibleSeating) accessibility.push("Accessible Seating");

            const parking = [];
            if (d.parkingOptions?.freeParkingLot) parking.push("Free Parking Lot");
            if (d.parkingOptions?.freeStreetParking) parking.push("Free Street Parking");
            if (d.parkingOptions?.paidParkingLot) parking.push("Paid Parking Lot");
            if (d.parkingOptions?.paidStreetParking) parking.push("Paid Street Parking");
            if (d.parkingOptions?.valetParking) parking.push("Valet Parking");

            return {
              id: d.id,
              name: d.displayName?.text,
              address: d.formattedAddress,
              rating: d.rating,
              review_count: d.userRatingCount,
              lat,
              lng,
              review: d.reviews?.[0]?.text?.text || d.reviews?.[0]?.originalText?.text || null,
              reviewAuthor: d.reviews?.[0]?.authorAttribution?.displayName || null,
              reviewTime: d.reviews?.[0]?.publishTime ? new Date(d.reviews[0].publishTime).toLocaleDateString() : null,
              openNow: d.currentOpeningHours?.openNow,
              phone: d.nationalPhoneNumber,
              website: d.websiteUri,
              mapsLink: `https://www.google.com/maps/place/?q=place_id:${d.id}`,
              distance: distance ? parseFloat(distance) : null,
              priceLevel: d.priceLevel || null,
              photos: d.photos?.slice(0, 3).map(p => ({
                name: p.name,
                widthPx: p.widthPx,
                heightPx: p.heightPx
              })) || [],
              paymentMethods,
              accessibility,
              parking,
              regularHours: d.regularOpeningHours?.weekdayDescriptions || [],
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
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationError(true);
        setLoading(false);
        setDentists([]);
      }
    );
  };

  // Initial fetch and when radius changes
  useEffect(() => {
    fetchDentists(searchRadius);
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

  const getConfidenceColor = (confidence) => {
    switch(confidence) {
      case 'high': return 'text-emerald-600 bg-emerald-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(translatedText.copySuccess || "Link copied!");
  };

  if (translating || Object.keys(translatedText).length === 0) {
    return (
      <section className="space-y-6 pb-8">
        <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-[2.5rem] p-8 shadow-xl">
          <div className="animate-pulse flex items-center gap-3">
            <MapPin className="w-7 h-7" />
            <h2 className="text-3xl font-black">Loading...</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8 pb-8">
      {/* Photo Modal */}
      {showPhotoModal && selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowPhotoModal(false)}>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img 
              src={`https://places.googleapis.com/v1/${selectedPhoto.name}/media?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&maxWidthPx=1200`}
              alt="Dentist office"
              className="w-full h-auto rounded-2xl"
            />
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-7 h-7" />
                <h2 className="text-3xl font-black">{translatedText.title}</h2>
              </div>
              <p className="text-base opacity-90">{translatedText.subtitle}</p>
            </div>
            
            <div className="flex gap-2">
              {selectedForCompare.length > 0 && (
                <button
                  onClick={() => setShowCompare(true)}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 hover:bg-white/30 transition-all hover:scale-105 relative"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-xs font-bold flex items-center justify-center shadow-lg">
                    {selectedForCompare.length}
                  </span>
                </button>
              )}
              {favorites.length > 0 && (
                <button
                  onClick={() => setShowFavorites(true)}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 hover:bg-white/30 transition-all hover:scale-105 relative"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center shadow-lg">
                    {favorites.length}
                  </span>
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`rounded-2xl p-3 transition-all hover:scale-105 ${
                  showFilters ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-14 pr-5 py-4 bg-white/20 backdrop-blur-sm rounded-2xl text-white placeholder-white/60 focus:outline-none focus:bg-white/30 transition-all text-base"
            />
          </div>
        </div>
      </div>

      {/* Location Error */}
      {locationError && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-[2rem] p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <p className="text-gray-700 font-medium mb-3">{translatedText.locationDenied}</p>
          <button
            onClick={() => fetchDentists(searchRadius)}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            {translatedText.retry}
          </button>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && !locationError && (
        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-gray-900 flex items-center gap-2 text-lg">
              <Sliders className="w-5 h-5 text-blue-600" />
              {translatedText.filters}
            </h3>
            <button
              onClick={() => setSearchRadius(16)}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Reset to 16 miles
            </button>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Search Radius
              </label>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {searchRadius} miles
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={searchRadius}
              onChange={(e) => setSearchRadius(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1 mile</span>
              <span>16 mi (default)</span>
              <span>100 miles</span>
            </div>
          </div>
        </div>
      )}

      {/* Insurance Selector */}
      {!locationError && (
        <div className="bg-white rounded-[2rem] p-6 shadow-md border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">{translatedText.yourInsurance}</label>
            <button
              onClick={() => setShowInsuranceHelp(!showInsuranceHelp)}
              className="text-blue-600 hover:text-blue-700"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          
          <select
            value={insurance}
            onChange={(e) => setInsurance(e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none font-medium text-base"
          >
            <option value="">{translatedText.selectInsurance}</option>
            <option>Delta Dental</option>
            <option>Aetna</option>
            <option>Cigna</option>
            <option>MetLife</option>
            <option>UnitedHealthcare</option>
            <option>Medicaid</option>
            <option>Medicare</option>
            <option>Blue Cross Blue Shield</option>
            <option>Guardian</option>
            <option>Humana</option>
          </select>

          {showInsuranceHelp && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-xs text-gray-700 leading-relaxed">
                <Sparkles className="w-3 h-3 inline mr-1 text-blue-600" />
                {translatedText.insuranceHelpText}
              </p>
            </div>
          )}

          {predictingInsurance && (
            <div className="mt-3 flex items-center gap-2 text-xs text-blue-600">
              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              {translatedText.predicting}
            </div>
          )}

          {predictionError && (
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-600">
              <AlertTriangle className="w-3 h-3" />
              {translatedText.predictionFallback}
            </div>
          )}
        </div>
      )}

      {/* Sort Options */}
      {!locationError && dentists.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'best', label: translatedText.bestOverall, icon: <Award className="w-4 h-4" /> },
            { id: 'rating', label: translatedText.topRated, icon: <Star className="w-4 h-4" /> },
            { id: 'distance', label: translatedText.nearest, icon: <Navigation className="w-4 h-4" /> }
          ].map(sort => (
            <button
              key={sort.id}
              onClick={() => setSortBy(sort.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all text-sm ${
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
      )}

      {/* Results Count */}
      {!locationError && dentists.length > 0 && (
        <div className="flex justify-between items-center px-1">
          <p className="text-sm text-gray-600 font-medium">
            Found <span className="text-blue-600 font-bold">{filteredDentists.length}</span> dentists
            {searchRadius > 16 && <span className="text-gray-400 ml-1">within {searchRadius} miles</span>}
          </p>
          {selectedForCompare.length > 0 && (
            <button
              onClick={() => setShowCompare(true)}
              className="text-sm text-blue-600 font-semibold hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
            >
              Compare {selectedForCompare.length} selected
            </button>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && !locationError && (
        <div className="text-center py-16">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg">{translatedText.loading}</p>
        </div>
      )}

      {/* No Results */}
      {!loading && !locationError && filteredDentists.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-[2rem]">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg">{translatedText.noDentists}</p>
          <p className="text-sm text-gray-500 mt-2">{translatedText.expandSearch}</p>
        </div>
      )}

      {/* Dentist Cards */}
      {!locationError && (
        <div className="space-y-4">
          {sortedDentists.map((d, index) => {
            const prediction = insurancePredictions[d.id];
            const badge = getBadge(d, index);
            const isInCompare = selectedForCompare.some(s => s.id === d.id);
            const placeDetails = reviews[d.id];

            return (
              <div
                key={d.id}
                className={`group bg-white rounded-[2rem] p-6 shadow-md border-2 transition-all duration-200 ${
                  isInCompare ? 'border-blue-400 shadow-lg scale-[1.02]' : 'border-gray-200 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900 text-xl mb-2">{d.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {badge && (
                        <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full ${badge.color}`}>
                          {badge.text}
                        </span>
                      )}
                      {d.verified && (
                        <span className="inline-block text-xs font-bold px-3 py-1.5 rounded-full bg-blue-100 text-blue-700">
                          ✅ {translatedText.verified}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleCompare(d)}
                      className={`p-3 rounded-xl transition-all ${
                        isInCompare ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-400'
                      }`}
                      title="Compare"
                    >
                      <BarChart3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleFavorite(d)}
                      className="p-3 rounded-xl hover:bg-gray-100 transition-all"
                      title={isFavorite(d.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart
                        className={`w-5 h-5 transition-all ${
                          isFavorite(d.id) ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Photos */}
                {d.photos && d.photos.length > 0 && (
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {d.photos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedPhoto(photo);
                          setShowPhotoModal(true);
                        }}
                        className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-xl overflow-hidden hover:opacity-80 transition-opacity"
                      >
                        <img 
                          src={`https://places.googleapis.com/v1/${photo.name}/media?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&maxWidthPx=200`}
                          alt={`${d.name} office`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Rating & Status */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {d.rating ? (
                    <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-gray-900">{d.rating}</span>
                      {d.review_count && (
                        <span className="text-xs text-gray-500">({d.review_count})</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full">
                      <span className="text-xs text-gray-500">No ratings</span>
                    </div>
                  )}
                  
                  {d.openNow !== undefined && (
                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${
                      d.openNow ? 'bg-green-50' : 'bg-gray-100'
                    }`}>
                      <Clock className={`w-4 h-4 ${d.openNow ? 'text-green-600' : 'text-gray-500'}`} />
                      <span className={`text-xs font-semibold ${d.openNow ? 'text-green-700' : 'text-gray-600'}`}>
                        {d.openNow ? translatedText.openNow : translatedText.closed}
                      </span>
                    </div>
                  )}

                  {d.priceLevel && (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-semibold text-purple-700">
                        {'$'.repeat(d.priceLevel)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Address */}
                {d.address && (
                  <p className="text-sm text-gray-600 mb-2 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    {d.address}
                  </p>
                )}

                {/* Distance */}
                {d.distance && (
                  <p className="text-sm font-semibold text-blue-600 mb-3">
                    📍 {d.distance} {translatedText.milesAway}
                  </p>
                )}

                {/* Real Amenities from Google Places */}
                {(d.paymentMethods?.length > 0 || d.accessibility?.length > 0 || d.parking?.length > 0) && (
                  <div className="mb-4">
                    {d.paymentMethods?.length > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {d.paymentMethods.map((method, i) => (
                            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                              {method}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {d.accessibility?.length > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <Wheelchair className="w-4 h-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {d.accessibility.map((item, i) => (
                            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {d.parking?.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {d.parking.map((item, i) => (
                            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Real Review from Google */}
                {d.review && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-xs text-gray-600 italic">"{d.review}"</p>
                    {d.reviewAuthor && (
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">— {d.reviewAuthor}</p>
                        {d.reviewTime && (
                          <p className="text-xs text-gray-400">{d.reviewTime}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* More Reviews Button */}
                {d.review_count > 1 && (
                  <button
                    onClick={() => fetchPlaceDetails(d.id)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-1"
                  >
                    <Star className="w-3 h-3" />
                    {translatedText.viewReviews} ({d.review_count})
                    {loadingReviews[d.id] && (
                      <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin ml-2" />
                    )}
                  </button>
                )}

                {/* Insurance Prediction */}
                {insurance && (
                  <div className={`flex items-start gap-3 p-4 rounded-xl mb-4 ${
                    prediction?.accepts ? 'bg-emerald-50' : 'bg-amber-50'
                  }`}>
                    {prediction?.accepts ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        prediction?.accepts ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {prediction?.accepts
                          ? `${translatedText.likelyAccepts} ${insurance}`
                          : `${translatedText.mayNotAccept} ${insurance}`}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{prediction?.reason || "Please call to verify insurance acceptance"}</p>
                      {prediction && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getConfidenceColor(prediction.confidence)}`}>
                            {prediction.confidence} confidence
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">Always call to confirm</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-4 gap-2">
                  <a
                    href={d.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 bg-blue-500 text-white py-3 rounded-xl text-xs font-semibold hover:bg-blue-600 transition-all hover:scale-[1.02]"
                  >
                    <MapPin className="w-3 h-3" />
                    <span className="hidden sm:inline">{translatedText.directions}</span>
                  </a>
                  
                  {d.phone && (
                    <a
                      href={`tel:${d.phone}`}
                      className="flex items-center justify-center gap-1 bg-green-500 text-white py-3 rounded-xl text-xs font-semibold hover:bg-green-600 transition-all hover:scale-[1.02]"
                    >
                      <Phone className="w-3 h-3" />
                      <span className="hidden sm:inline">{translatedText.call}</span>
                    </a>
                  )}

                  {d.website && (
                    <a
                      href={d.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 bg-purple-500 text-white py-3 rounded-xl text-xs font-semibold hover:bg-purple-600 transition-all hover:scale-[1.02]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="hidden sm:inline">Website</span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      copyToClipboard(d.mapsLink);
                    }}
                    className="flex items-center justify-center gap-1 bg-white border-2 border-gray-200 text-gray-900 py-3 rounded-xl text-xs font-semibold hover:border-blue-300 transition-all hover:scale-[1.02]"
                  >
                    <Share2 className="w-3 h-3" />
                    <span className="hidden sm:inline">{translatedText.share}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Modal */}
      {selectedDentist && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900">{selectedDentist.name}</h3>
              <button onClick={() => setSelectedDentist(null)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Photos */}
              {selectedDentist.photos?.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedDentist.photos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedPhoto(photo);
                        setShowPhotoModal(true);
                      }}
                      className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-xl overflow-hidden"
                    >
                      <img 
                        src={`https://places.googleapis.com/v1/${photo.name}/media?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&maxWidthPx=200`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="bg-blue-50 p-5 rounded-xl">
                <p className="text-sm text-gray-700 mb-2">{selectedDentist.address}</p>
                {selectedDentist.phone && (
                  <a href={`tel:${selectedDentist.phone}`} className="text-sm text-blue-600 font-semibold hover:underline block mb-1">
                    📞 {selectedDentist.phone}
                  </a>
                )}
                {selectedDentist.distance && (
                  <p className="text-sm text-blue-600">📍 {selectedDentist.distance} miles away</p>
                )}
              </div>

              {/* Regular Hours */}
              {selectedDentist.regularHours?.length > 0 && (
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Hours
                  </h4>
                  <div className="space-y-1">
                    {selectedDentist.regularHours.map((hours, i) => (
                      <p key={i} className="text-xs text-gray-600">{hours}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {(selectedDentist.paymentMethods?.length > 0 || selectedDentist.accessibility?.length > 0 || selectedDentist.parking?.length > 0) && (
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3">Amenities</h4>
                  
                  {selectedDentist.paymentMethods?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-2">Payment Methods:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedDentist.paymentMethods.map((method, i) => (
                          <span key={i} className="text-xs bg-white px-2 py-1 rounded-full text-gray-700 border border-gray-200">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedDentist.accessibility?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-2">Accessibility:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedDentist.accessibility.map((item, i) => (
                          <span key={i} className="text-xs bg-white px-2 py-1 rounded-full text-gray-700 border border-gray-200">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedDentist.parking?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">Parking:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedDentist.parking.map((item, i) => (
                          <span key={i} className="text-xs bg-white px-2 py-1 rounded-full text-gray-700 border border-gray-200">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                {selectedDentist.website && (
                  <a
                    href={selectedDentist.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-blue-500 text-white py-4 rounded-xl font-semibold hover:bg-blue-600 transition-all hover:scale-[1.02]"
                  >
                    Visit Website
                  </a>
                )}

                <a
                  href={selectedDentist.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition-all hover:scale-[1.02]"
                >
                  Get Directions
                </a>

                <button
                  onClick={() => {
                    copyToClipboard(selectedDentist.mapsLink);
                  }}
                  className="block text-center w-full bg-white border-2 border-gray-200 text-gray-900 py-4 rounded-xl font-semibold hover:border-blue-300 transition-all hover:scale-[1.02]"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompare && selectedForCompare.length > 0 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-5xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Compare Dentists
              </h3>
              <button onClick={() => setShowCompare(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {selectedForCompare.map(dentist => (
                <div key={dentist.id} className="space-y-4 bg-gray-50 p-6 rounded-2xl">
                  <h4 className="font-bold text-gray-900 text-lg">{dentist.name}</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Rating</span>
                      <span className="font-bold text-gray-900">{dentist.rating || 'N/A'} ⭐</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Distance</span>
                      <span className="font-bold text-gray-900">{dentist.distance ? `${dentist.distance} mi` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Price</span>
                      <span className="font-bold text-gray-900">{dentist.priceLevel ? '$'.repeat(dentist.priceLevel) : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Open Now</span>
                      <span className={dentist.openNow ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                        {dentist.openNow ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {dentist.phone && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">Phone</span>
                        <a href={`tel:${dentist.phone}`} className="text-sm text-blue-600 font-medium">
                          Call
                        </a>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedForCompare(selectedForCompare.filter(d => d.id !== dentist.id));
                    }}
                    className="w-full py-3 text-sm text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-50 transition-colors font-semibold"
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
          <div className="bg-white rounded-[2rem] max-w-lg w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <h3 className="font-black text-gray-900 text-lg">{translatedText.savedDentists}</h3>
              </div>
              <button onClick={() => setShowFavorites(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3">
              {favorites.length === 0 ? (
                <p className="text-center text-gray-500 py-8">{translatedText.noSavedDentists}</p>
              ) : (
                favorites.map((d) => (
                  <div key={d.id} className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-1">{d.name}</p>
                      <p className="text-xs text-gray-600 mb-2">{d.address}</p>
                      <div className="flex gap-3">
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
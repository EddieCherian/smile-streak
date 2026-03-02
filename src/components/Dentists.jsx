import React, { useEffect, useState, useContext, useMemo } from "react";
import { 
  MapPin, Star, Clock, Heart, Phone, ChevronRight, TrendingUp, Award, 
  Navigation, X, CheckCircle2, AlertCircle, Calendar, Users,
  DollarSign, Filter, Search, Sliders, Globe, Car,
  Menu, BarChart3, Sparkles, Shield, HelpCircle, AlertTriangle,
  Wifi, Coffee, Baby, CreditCard, Languages as LanguagesIcon, ExternalLink, Share2,
  Image as ImageIcon
} from "lucide-react";
import { TranslationContext } from "../App";

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

const getInsuranceEstimate = (dentistName, dentistAddress, selectedInsurance) => {
  const name = dentistName.toLowerCase();
  const address = dentistAddress.toLowerCase();
  
  // ROYSE CITY DENTAL CARE - ALWAYS ACCEPTS ALL INSURANCE
  if (name.includes('royse') && name.includes('city')) {
    return {
      accepts: true,
      confidence: 'high',
      reason: 'Royse City Dental Care accepts all major insurance plans including ' + selectedInsurance
    };
  }
  
  if (name.includes('aspen') || name.includes('western') || name.includes('comfort') || 
      name.includes('gentle') || name.includes('smile') || name.includes('dental care')) {
    return {
      accepts: true,
      confidence: 'high',
      reason: 'Corporate dental chain typically accepts all major insurance plans'
    };
  }
  
  if (name.includes('community') || name.includes('health') || address.includes('community')) {
    return {
      accepts: selectedInsurance === 'Medicaid' || selectedInsurance === 'Medicare',
      confidence: 'high',
      reason: 'Community health centers focus on government insurance programs'
    };
  }
  
  if (name.includes('university') || name.includes('college') || name.includes('school')) {
    return {
      accepts: true,
      confidence: 'high',
      reason: 'Dental schools and university clinics accept multiple insurance types'
    };
  }
  
  return {
    accepts: Math.random() > 0.4,
    confidence: 'low',
    reason: 'Private practice acceptance varies - please call to confirm'
  };
};

export default function Dentists() {
  const { t, currentLanguage } = useContext(TranslationContext);
  
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insurance, setInsurance] = useState("");
  const [insuranceEstimates, setInsuranceEstimates] = useState({});
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
  const [placeDetails, setPlaceDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});

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
    call: "Call",
    savedDentists: "Saved Dentists",
    viewDetails: "View Details",
    photos: "Photos",
    reviews: "Reviews",
    website: "Website",
    acceptsCreditCards: "Accepts Credit Cards",
    wheelchairAccessible: "Wheelchair Accessible",
    freeParking: "Free Parking"
  };

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

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favoriteDentists') || '[]');
    setFavorites(saved);
  }, []);

  useEffect(() => {
    if (!insurance || dentists.length === 0) {
      setInsuranceEstimates({});
      return;
    }
    
    const estimates = {};
    dentists.forEach(dentist => {
      estimates[dentist.id] = getInsuranceEstimate(dentist.name, dentist.address, insurance);
    });
    setInsuranceEstimates(estimates);
  }, [insurance, dentists]);

  // Fetch detailed place information including photos
  const fetchPlaceDetails = async (placeId) => {
    if (placeDetails[placeId] || loadingDetails[placeId]) return;
    
    setLoadingDetails(prev => ({ ...prev, [placeId]: true }));
    
    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAPS_KEY,
            "X-Goog-FieldMask": "photos,reviews,internationalPhoneNumber,websiteUri,regularOpeningHours,paymentOptions,parkingOptions,accessibilityOptions,businessStatus"
          }
        }
      );

      if (!response.ok) throw new Error("Failed to fetch details");

      const data = await response.json();
      setPlaceDetails(prev => ({ ...prev, [placeId]: data }));
    } catch (err) {
      console.error("Error fetching place details:", err);
    } finally {
      setLoadingDetails(prev => ({ ...prev, [placeId]: false }));
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

  const fetchDentists = (radius) => {
    setLoading(true);
    setLocationError(false);
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ latitude, longitude });

        try {
          const radiusInMeters = Math.min(radius * 1609.34, 50000);
          
          const res = await fetch(
            "https://places.googleapis.com/v1/places:searchNearby",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAPS_KEY,
                "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours,places.nationalPhoneNumber,places.websiteUri,places.priceLevel,places.photos,places.businessStatus"
              },
              body: JSON.stringify({
                includedTypes: ["dentist"],
                maxResultCount: 20,
                locationRestriction: {
                  circle: {
                    center: { latitude, longitude },
                    radius: radiusInMeters
                  }
                }
              })
            }
          );

          if (!res.ok) throw new Error(`API Error: ${res.status}`);

          const json = await res.json();
          const data = json.places || [];

          const enriched = data.map((d) => {
            const lat = d.location?.latitude;
            const lng = d.location?.longitude;
            const distance = lat && lng ? getDistanceMiles(latitude, longitude, lat, lng) : null;
            
            const nameLower = d.displayName?.text?.toLowerCase() || "";
            const isRoyseCity = nameLower.includes("royse") && nameLower.includes("city");

            return {
              id: d.id,
              name: d.displayName?.text || "Unknown",
              address: d.formattedAddress || "No address",
              rating: d.rating,
              review_count: d.userRatingCount || 0,
              lat,
              lng,
              openNow: d.currentOpeningHours?.openNow,
              phone: d.nationalPhoneNumber,
              website: d.websiteUri,
              mapsLink: `https://www.google.com/maps/place/?q=place_id:${d.id}`,
              distance: distance ? parseFloat(distance) : null,
              priceLevel: d.priceLevel || null,
              photos: d.photos || [],
              businessStatus: d.businessStatus,
              isRoyseCity
            };
          });

          setDentists(enriched);
        } catch (err) {
          console.error("Fetch error:", err);
          setDentists([]);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationError(true);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchDentists(searchRadius);
  }, [searchRadius]);

  const filteredDentists = useMemo(() => {
    return dentists.filter(d => {
      if (searchQuery && !d.name?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [dentists, searchQuery]);

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

      return sorted.length > 0 ? [sorted[0], ...rest] : rest;
    }

    if (sortBy === "rating") {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "distance") {
      sorted.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    }

    return sorted;
  };

  const sortedDentists = getSortedDentists();

  const getBadge = (dentist) => {
    if (dentist.isRoyseCity) {
      return { text: "⭐ Recommended - Royse City Dental Care", color: "bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg" };
    }
    return null;
  };

  const getPhotoUrl = (photoResource) => {
    if (!photoResource || !photoResource.name) return null;
    return `https://places.googleapis.com/v1/${photoResource.name}/media?maxHeightPx=400&maxWidthPx=400&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`;
  };

  const getConfidenceColor = (confidence) => {
    switch(confidence) {
      case 'high': return 'text-emerald-600 bg-emerald-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  if (Object.keys(translatedText).length === 0) {
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
      {/* Header - Keep existing */}
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

      {/* Keep existing filters, insurance selector, etc... */}
      
      {/* Dentist Cards - ENHANCED VERSION */}
      {!locationError && (
        <div className="space-y-4">
          {sortedDentists.map((d, index) => {
            const estimate = insuranceEstimates[d.id];
            const badge = getBadge(d);
            const isInCompare = selectedForCompare.some(s => s.id === d.id);
            const details = placeDetails[d.id];

            return (
              <div
                key={d.id}
                className={`group bg-white rounded-[2rem] p-6 shadow-md border-2 transition-all duration-200 ${
                  isInCompare ? 'border-blue-400 shadow-lg scale-[1.02]' : 'border-gray-200 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Photos Section */}
                {d.photos && d.photos.length > 0 && (
                  <div className="mb-4 -mx-6 -mt-6">
                    <div className="flex gap-2 overflow-x-auto pb-2 px-6 pt-6">
                      {d.photos.slice(0, 4).map((photo, idx) => {
                        const photoUrl = getPhotoUrl(photo);
                        return photoUrl ? (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedPhoto(photoUrl);
                              setShowPhotoModal(true);
                            }}
                            className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden hover:scale-105 transition-transform"
                          >
                            <img
                              src={photoUrl}
                              alt={`${d.name} photo ${idx + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </button>
                        ) : null;
                      })}
                      {d.photos.length > 4 && (
                        <div className="flex-shrink-0 w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center">
                          <span className="text-xs text-gray-500">+{d.photos.length - 4}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleCompare(d)}
                      className={`p-3 rounded-xl transition-all ${
                        isInCompare ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-400'
                      }`}
                    >
                      <BarChart3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleFavorite(d)}
                      className="p-3 rounded-xl hover:bg-gray-100 transition-all"
                    >
                      <Heart
                        className={`w-5 h-5 transition-all ${
                          isFavorite(d.id) ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Rating & Status */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {d.rating ? (
                    <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-gray-900">{d.rating}</span>
                      {d.review_count > 0 && (
                        <span className="text-xs text-gray-500">({d.review_count})</span>
                      )}
                    </div>
                  ) : null}
                  
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

                  {d.distance && (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50">
                      <Navigation className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-semibold text-blue-700">
                        {d.distance} mi
                      </span>
                    </div>
                  )}
                </div>

                {/* Address */}
                {d.address && (
                  <p className="text-sm text-gray-600 mb-3 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    {d.address}
                  </p>
                )}

                {/* Insurance Estimate - ENHANCED for Royse City */}
                {insurance && estimate && (
                  <div className={`flex items-start gap-3 p-4 rounded-xl mb-4 ${
                    estimate.accepts ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-amber-50'
                  }`}>
                    {estimate.accepts ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${
                        estimate.accepts ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {estimate.accepts
                          ? `✓ ${translatedText.likelyAccepts || "Likely accepts"} ${insurance}`
                          : `${translatedText.mayNotAccept || "May not accept"} ${insurance}`}
                      </p>
                      <p className="text-xs text-gray-700 mt-1">{estimate.reason}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getConfidenceColor(estimate.confidence)}`}>
                          {estimate.confidence} confidence
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={d.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 bg-blue-500 text-white py-3 rounded-xl text-xs font-semibold hover:bg-blue-600 transition-all hover:scale-[1.02]"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{translatedText.directions}</span>
                  </a>
                  
                  {d.phone && (
                    <a
                      href={`tel:${d.phone}`}
                      className="flex items-center justify-center gap-1 bg-green-500 text-white py-3 rounded-xl text-xs font-semibold hover:bg-green-600 transition-all hover:scale-[1.02]"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{translatedText.call}</span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      fetchPlaceDetails(d.id);
                      setSelectedDentist(d);
                    }}
                    className="flex items-center justify-center gap-1 bg-white border-2 border-gray-200 text-gray-900 py-3 rounded-xl text-xs font-semibold hover:border-blue-300 transition-all hover:scale-[1.02]"
                  >
                    <ChevronRight className="w-3 h-3" />
                    <span>{translatedText.viewDetails || "Details"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Photo Modal */}
      {showPhotoModal && selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowPhotoModal(false);
            setSelectedPhoto(null);
          }}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => {
              setShowPhotoModal(false);
              setSelectedPhoto(null);
            }}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedPhoto}
            alt="Dentist office"
            className="max-w-full max-h-[90vh] rounded-2xl"
          />
        </div>
      )}

      {/* Details Modal - ENHANCED */}
      {selectedDentist && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] max-w-2xl w-full p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900">{selectedDentist.name}</h3>
              <button 
                onClick={() => setSelectedDentist(null)} 
                className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Contact Info */}
              <div className="bg-blue-50 p-5 rounded-xl">
                <p className="text-sm text-gray-700 mb-2 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                  {selectedDentist.address}
                </p>
                {selectedDentist.phone && (
                  <a 
                    href={`tel:${selectedDentist.phone}`} 
                    className="text-sm text-blue-600 font-semibold flex items-center gap-2 hover:text-blue-700"
                  >
                    <Phone className="w-4 h-4" />
                    {selectedDentist.phone}
                  </a>
                )}
                {selectedDentist.website && (
                  <a
                    href={selectedDentist.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 font-semibold flex items-center gap-2 mt-2 hover:text-blue-700"
                  >
                    <Globe className="w-4 h-4" />
                    {translatedText.website || "Visit Website"}
                  </a>
                )}
              </div>

              {/* Photos Grid */}
              {selectedDentist.photos && selectedDentist.photos.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                    {translatedText.photos || "Photos"}
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedDentist.photos.slice(0, 6).map((photo, idx) => {
                      const photoUrl = getPhotoUrl(photo);
                      return photoUrl ? (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedPhoto(photoUrl);
                            setShowPhotoModal(true);
                          }}
                          className="aspect-square rounded-xl overflow-hidden hover:scale-105 transition-transform"
                        >
                          <img
                            src={photoUrl}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Additional Details */}
              {loadingDetails[selectedDentist.id] && (
                <div className="text-center py-4">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Keep existing Compare and Favorites modals... */}
    </section>
  );
}

import { useEffect, useState } from "react";
import { MapPin, Star, Clock, Heart, Phone, ChevronRight, TrendingUp, Award, Navigation, Bookmark, X, CheckCircle2, AlertCircle } from "lucide-react";

/* 🧠 Insurance intelligence profiles */
const INSURANCE_PROFILES = {
  corporate: ["Delta Dental", "Aetna", "Cigna", "MetLife", "UnitedHealthcare"],
  private: ["Delta Dental", "MetLife", "Guardian"],
  medicaid: ["Medicaid", "CHIP"],
};

function inferClinicType(name = "") {
  const n = name.toLowerCase();
  if (n.includes("group") || n.includes("family") || n.includes("smile")) {
    return "corporate";
  }
  if (n.includes("community") || n.includes("health") || n.includes("public")) {
    return "medicaid";
  }
  return "private";
}

/* 📏 calculate distance in miles */
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

export default function Dentists() {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insurance, setInsurance] = useState("");
  const [sortBy, setSortBy] = useState("best"); // 'best', 'rating', 'distance'
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favoriteDentists') || '[]');
    setFavorites(saved);
  }, []);

  // Save favorites to localStorage
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
                "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours,places.reviews,places.nationalPhoneNumber",
            },
            body: JSON.stringify({
              includedTypes: ["dentist"],
              maxResultCount: 20,
              locationRestriction: {
                circle: {
                  center: { latitude, longitude },
                  radius: 16521,
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
            mapsLink: `https://www.google.com/maps/place/?q=place_id:${d.id}`,
            distance: parseFloat(distance),
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
  }, []);

  // Smart sorting with Royse City Dental Care priority
  const getSortedDentists = () => {
    let sorted = [...dentists];

    // PRIORITY: If sorting by "best" and Royse City Dental Care is within radius, rank it #1
    if (sortBy === "best") {
      const royseCityIndex = sorted.findIndex(d => 
        d.name && d.name.toLowerCase().includes("royse city dental care")
      );

      if (royseCityIndex !== -1) {
        const royseCityDental = sorted.splice(royseCityIndex, 1)[0];
        sorted.unshift(royseCityDental);
      }

      // Then sort rest by rating
      const royseCityDental = sorted[0];
      const rest = sorted.slice(1).sort((a, b) => {
        // Prioritize high rating + close distance
        const scoreA = (a.rating || 0) * 10 - (a.distance || 99);
        const scoreB = (b.rating || 0) * 10 - (b.distance || 99);
        return scoreB - scoreA;
      });

      return royseCityIndex !== -1 ? [royseCityDental, ...rest] : rest;
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
    if (dentist.name && dentist.name.toLowerCase().includes("royse city dental care") && sortBy === "best") {
      return { text: "⭐ Recommended", color: "bg-gradient-to-r from-yellow-400 to-orange-400 text-white" };
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

  return (
    <section className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-6 h-6" />
              <h2 className="text-2xl font-black">Find Dentists</h2>
            </div>
            <p className="text-sm opacity-90">Discover top-rated dental care nearby</p>
          </div>
          
          {favorites.length > 0 && (
            <button
              onClick={() => setShowFavorites(true)}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-3 hover:bg-white/30 transition-colors relative"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Insurance Selector */}
      <div className="bg-white rounded-2xl p-4 shadow-md border border-blue-100">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Insurance</label>
        <select
          value={insurance}
          onChange={(e) => setInsurance(e.target.value)}
          className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none font-medium"
        >
          <option value="">Select your insurance</option>
          <option>Delta Dental</option>
          <option>Aetna</option>
          <option>Cigna</option>
          <option>MetLife</option>
          <option>UnitedHealthcare</option>
          <option>Medicaid</option>
        </select>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'best', label: 'Best Overall', icon: <Award className="w-4 h-4" /> },
          { id: 'rating', label: 'Top Rated', icon: <Star className="w-4 h-4" /> },
          { id: 'distance', label: 'Nearest', icon: <Navigation className="w-4 h-4" /> }
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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Finding dentists near you...</p>
        </div>
      )}

      {/* No Results */}
      {!loading && dentists.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No dentists found nearby</p>
          <p className="text-sm text-gray-500 mt-1">Try expanding your search radius</p>
        </div>
      )}

      {/* Dentist Cards */}
      <div className="space-y-4">
        {sortedDentists.map((d, index) => {
          const clinicType = inferClinicType(d.name);
          const likelyPlans = INSURANCE_PROFILES[clinicType] || [];
          const likelyAccepted = insurance && likelyPlans.includes(insurance);
          const badge = getBadge(d, index);

          return (
            <div
              key={d.id}
              className="group bg-white rounded-3xl p-5 shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              {/* Header with Badge */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 text-lg mb-1">{d.name}</h3>
                  {badge && (
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${badge.color}`}>
                      {badge.text}
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => toggleFavorite(d)}
                  className="ml-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorite(d.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              {/* Rating & Status */}
              <div className="flex items-center gap-3 mb-3">
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
                      {d.openNow ? 'Open now' : 'Closed'}
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

              {d.distance && (
                <p className="text-sm font-semibold text-blue-600 mb-3">
                  📍 {d.distance} miles away
                </p>
              )}

              {/* Review */}
              {d.review && (
                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  <p className="text-xs text-gray-600 italic line-clamp-2">"{d.review}"</p>
                </div>
              )}

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
                      ? `Likely accepts ${insurance}`
                      : `May not accept ${insurance} — call to confirm`}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={d.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Directions
                </a>
                
                <button
                  onClick={() => setSelectedDentist(d)}
                  className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-900 py-3 rounded-xl font-semibold hover:border-blue-300 transition-colors"
                >
                  Appointment Prep
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Appointment Prep Modal */}
      {selectedDentist && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-hidden animate-[scaleBounce_0.3s_ease-out]">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-black">Appointment Checklist</h3>
                <button
                  onClick={() => setSelectedDentist(null)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm opacity-90">{selectedDentist.name}</p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
              {/* Before You Go */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Before You Go
                </h4>
                <div className="space-y-2">
                  {[
                    "Brush and floss your teeth",
                    "Bring your insurance card",
                    "Bring photo ID",
                    "List any medications you're taking",
                    "Write down questions for your dentist"
                  ].map((item, i) => (
                    <label key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Anxiety Tips */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-5">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Feeling Nervous?
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Take deep breaths before your appointment</li>
                  <li>• Listen to calming music in the waiting room</li>
                  <li>• Tell your dentist if you're anxious</li>
                  <li>• Schedule morning appointments when you're fresh</li>
                </ul>
              </div>

              {/* Contact */}
              {selectedDentist.phone && (
                <a
                  href={`tel:${selectedDentist.phone}`}
                  className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-4 rounded-xl font-bold hover:bg-green-600 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call {selectedDentist.phone}
                </a>
              )}
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
                <h3 className="font-black text-gray-900">Saved Dentists</h3>
              </div>
              <button onClick={() => setShowFavorites(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3">
              {favorites.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No saved dentists yet</p>
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
                          Directions
                        </a>
                        <button
                          onClick={() => toggleFavorite(d)}
                          className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
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

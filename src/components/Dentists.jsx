import { useEffect, useState } from "react";

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
  const [userLoc, setUserLoc] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setUserLoc({ latitude, longitude });

      try {

        /* ✅ FIXED FETCH — only thing changed */
        const res = await fetch(`/api/dentists?lat=${latitude}&lng=${longitude}`);

        if (!res.ok) {
          throw new Error("API request failed");
        }

        const data = await res.json();

        const enriched = (data || []).map((d) => {
          const lat = d.location?.latitude;
          const lng = d.location?.longitude;

          return {
            id: d.id,
            name: d.displayName?.text,
            address: d.formattedAddress,
            rating: d.rating,
            review_count: d.userRatingCount,
            lat,
            lng,
            review:
              d.reviews?.[0]?.text?.text ||
              d.reviews?.[0]?.originalText?.text ||
              null,
            openNow: d.currentOpeningHours?.openNow,
            mapsLink: `https://www.google.com/maps/place/?q=place_id:${d.id}`,
          };
        });

        const withDistance = enriched.map((d) => ({
          ...d,
          distance:
            userLoc && d.lat
              ? getDistanceMiles(
                  latitude,
                  longitude,
                  d.lat,
                  d.lng
                )
              : null,
        }));

        // sort by distance then rating
        withDistance.sort((a, b) => {
          if (a.distance && b.distance) {
            return a.distance - b.distance;
          }
          return (b.rating || 0) - (a.rating || 0);
        });

        setDentists(withDistance);
      } catch (err) {
        console.error("Dentist fetch failed:", err);
        setDentists([]);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Nearby Dentists 🦷</h2>

      <select
        value={insurance}
        onChange={(e) => setInsurance(e.target.value)}
        className="w-full p-3 rounded-xl border"
      >
        <option value="">Select your insurance</option>
        <option>Delta Dental</option>
        <option>Aetna</option>
        <option>Cigna</option>
        <option>MetLife</option>
        <option>UnitedHealthcare</option>
        <option>Medicaid</option>
      </select>

      {loading && <p className="text-gray-500">Finding dentists near you…</p>}
      {!loading && dentists.length === 0 && (
        <p className="text-gray-500">No dentists found nearby.</p>
      )}

      {dentists.map((d) => {
        const clinicType = inferClinicType(d.name);
        const likelyPlans = INSURANCE_PROFILES[clinicType] || [];
        const likelyAccepted = insurance && likelyPlans.includes(insurance);

        return (
          <div key={d.id} className="bg-white p-5 rounded-2xl border shadow-sm space-y-2">

            <div className="flex justify-between items-start">
              <p className="font-semibold">{d.name}</p>

              {d.openNow !== undefined && (
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    d.openNow ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {d.openNow ? "Open now" : "Closed"}
                </span>
              )}
            </div>

            {d.rating && (
              <p className="text-sm text-yellow-600 font-medium">
                ⭐ {d.rating} / 5 ({d.review_count} reviews)
              </p>
            )}

            {d.address && (
              <p className="text-sm text-gray-500">{d.address}</p>
            )}

            {d.distance && (
              <p className="text-sm text-blue-600">{d.distance} miles away</p>
            )}

            {d.review && (
              <p className="text-sm italic text-gray-600 line-clamp-3">
                “{d.review}”
              </p>
            )}

            <p className="text-sm text-gray-500 capitalize">
              Clinic type: {clinicType}
            </p>

            {insurance && (
              <p
                className={`text-sm font-medium ${
                  likelyAccepted ? "text-green-600" : "text-orange-500"
                }`}
              >
                {likelyAccepted
                  ? `Likely accepts ${insurance}`
                  : `May not accept ${insurance} — call to confirm`}
              </p>
            )}

            <a
              href={d.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-blue-700 font-medium"
            >
              View on Google Maps →
            </a>
          </div>
        );
      })}
    </section>
  );
}

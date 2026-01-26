import { useEffect, useState } from "react";

/* 🧠 Insurance intelligence profiles */
const INSURANCE_PROFILES = {
  corporate: [
    "Delta Dental",
    "Aetna",
    "Cigna",
    "MetLife",
    "UnitedHealthcare",
  ],
  private: ["Delta Dental", "MetLife", "Guardian"],
  medicaid: ["Medicaid", "CHIP"],
};

/* 🧠 Infer clinic type from name (probabilistic, not a claim) */
function inferClinicType(tags = {}) {
  const name = (tags.name || "").toLowerCase();

  if (
    name.includes("group") ||
    name.includes("family") ||
    name.includes("smile")
  ) {
    return "corporate";
  }

  if (name.includes("community") || name.includes("health")) {
    return "medicaid";
  }

  return "private";
}

export default function Dentists() {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insurance, setInsurance] = useState("");

  /* 📍 Fetch nearby dentists (Yelp → fallback to OpenStreetMap) */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          // 1️⃣ Try Yelp first
          const res = await fetch(
            `/api/yelp?lat=${latitude}&lng=${longitude}`
          );

          if (!res.ok) {
            throw new Error("Yelp failed");
          }

          const data = await res.json();
          setDentists(data.businesses || []);
        } catch (err) {
          console.warn("Yelp failed, using OpenStreetMap fallback");

          // 2️⃣ Fallback: OpenStreetMap
          const query = `
            [out:json];
            node
              ["amenity"="dentist"]
              (around:5000,${latitude},${longitude});
            out tags;
          `;

          try {
            const res = await fetch(
              "https://overpass-api.de/api/interpreter",
              {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: query,
              }
            );

            const data = await res.json();

            // Normalize OSM data to match Yelp shape
            const normalized = (data.elements || []).map((d) => ({
              id: d.id,
              name: d.tags?.name || "Unnamed Dental Clinic",
              rating: null,
              review_count: null,
            }));

            setDentists(normalized);
          } catch (fallbackErr) {
            console.error("Fallback failed:", fallbackErr);
            setDentists([]);
          }
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Geolocation failed:", err);
        setLoading(false);
      }
    );
  }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Nearby Dentists 🦷</h2>

      {/* 🧠 Insurance selector */}
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

      {/* 🏥 Dentist list */}
      {dentists.map((d) => {
        const clinicType = inferClinicType({ name: d.name });
        const likelyPlans = INSURANCE_PROFILES[clinicType] || [];
        const likelyAccepted =
          insurance && likelyPlans.includes(insurance);

        return (
          <div
            key={d.id}
            className="bg-white p-5 rounded-2xl border shadow-sm space-y-1"
          >
            <p className="font-semibold">{d.name}</p>

            {/* ⭐ Yelp rating (rating only, safe fallback) */}
            {d.rating && (
              <p className="text-sm text-yellow-600 font-medium">
                ⭐ {d.rating} / 5
                {d.review_count ? ` (${d.review_count} reviews)` : ""}
              </p>
            )}

            <p className="text-sm text-gray-500 capitalize">
              Clinic type: {clinicType}
            </p>

            {insurance && (
              <p
                className={`text-sm font-medium ${
                  likelyAccepted
                    ? "text-green-600"
                    : "text-orange-500"
                }`}
              >
                {likelyAccepted
                  ? `Likely accepts ${insurance}`
                  : `May not accept ${insurance} — call to confirm`}
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}

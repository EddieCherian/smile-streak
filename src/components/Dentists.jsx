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

  /* 📍 Fetch nearby dentists using Yelp (browser-safe via proxy) */
  useEffect(() => {
    const YELP_API_KEY = "KKVs0W-kP-VksWrRFr9lnLFrOMLlNr8yHfjOau1EPSbkYMhxvppPXsG6jjYOS-s9QUj_IS43BYWiqUvWPgDXSyJ_mATKuhhZJnnPK4UiqrHMNq5HdmfpnOcX0ep3aXYx";

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://corsproxy.io/?https://api.yelp.com/v3/businesses/search?term=dentist&latitude=${latitude}&longitude=${longitude}&limit=10`,
            {
              headers: {
                Authorization: `Bearer ${YELP_API_KEY}`,
              },
            }
          );

          const data = await res.json();

          // 🔁 Normalize Yelp data to match your existing intelligence system
          const normalized = (data.businesses || []).map((b) => ({
            id: b.id,
            tags: {
              name: b.name,
            },
          }));

          setDentists(normalized);
        } catch (err) {
          console.error("Yelp fetch failed:", err);
          setDentists([]);
        } finally {
          setLoading(false);
        }
      },
      () => {
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
        const clinicType = inferClinicType(d.tags);
        const likelyPlans = INSURANCE_PROFILES[clinicType] || [];
        const likelyAccepted =
          insurance && likelyPlans.includes(insurance);

        return (
          <div
            key={d.id}
            className="bg-white p-5 rounded-2xl border shadow-sm space-y-1"
          >
            <p className="font-semibold">
              {d.tags.name || "Unnamed Dental Clinic"}
            </p>

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

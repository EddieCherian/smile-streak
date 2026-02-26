export default async function handler(req, res) {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  try {
    const googleRes = await fetch(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_MAPS_KEY,

          // ⚠️ MUST be one line, comma separated
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours",
        },
        body: JSON.stringify({
          includedTypes: ["dentist"],
          maxResultCount: 12,
          locationRestriction: {
            circle: {
              center: {
                latitude: Number(lat),
                longitude: Number(lng),
              },
              radius: 5000,
            },
          },
        }),
      }
    );

    const data = await googleRes.json();

    // helpful debug if Google errors
    if (!googleRes.ok) {
      console.error("Google error:", data);
      return res.status(googleRes.status).json(data);
    }

    res.status(200).json(data.places || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Google Places request failed" });
  }
}

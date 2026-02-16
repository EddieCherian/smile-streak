export default async function handler(req, res) {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const base64 = image.split(",")[1];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    "You are a dental hygiene assistant. Give short practical feedback on brushing, plaque visibility, and gum care. Do NOT diagnose disease.",
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // If Gemini returned an error, show it in logs
    if (!response.ok) {
      console.error("GEMINI ERROR:", data);
      return res.status(500).json({ error: "Gemini request failed" });
    }

    const feedback =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No feedback returned";

    res.status(200).json({ feedback });

  } catch (err) {
    console.error("SCAN ERROR:", err);
    res.status(500).json({ error: "AI analysis failed" });
  }
}
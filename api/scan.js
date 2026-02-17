export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const base64 = image.split(",")[1];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

    if (!response.ok) {
      console.error("GEMINI ERROR:", data);
      console.error("STATUS:", response.status);
      console.error("API KEY EXISTS:", !!process.env.GEMINI_API_KEY);
      return res.status(500).json({ error: "Gemini request failed", details: data });
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

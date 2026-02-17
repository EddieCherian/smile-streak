import { GoogleGenerativeAI } from "@google/generative-ai";

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

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const base64 = image.split(",")[1];

    const imageParts = [
      {
        inlineData: {
          data: base64,
          mimeType: "image/jpeg",
        },
      },
    ];

    const prompt = "You are a dental hygiene assistant. Give short practical feedback on brushing, plaque visibility, and gum care. Do NOT diagnose disease.";

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const feedback = response.text();

    res.status(200).json({ feedback });

  } catch (err) {
    console.error("SCAN ERROR:", err);
    console.error("ERROR DETAILS:", err.message);
    res.status(500).json({ error: "AI analysis failed", details: err.message });
  }
}

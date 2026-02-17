import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // LIST ALL AVAILABLE MODELS
    console.log("Listing available models...");
    const models = await genAI.listModels();
    console.log("Available models:", JSON.stringify(models, null, 2));
    
    // Return the list so you can see it
    return res.status(200).json({ 
      message: "Check Vercel logs for available models",
      modelCount: models.length,
      models: models.map(m => m.name)
    });

  } catch (err) {
    console.error("ERROR:", err);
    console.error("ERROR DETAILS:", err.message);
    res.status(500).json({ error: "Failed to list models", details: err.message });
  }
}

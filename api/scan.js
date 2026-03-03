import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Initialize the Gemini API with your key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // List of models to try, from oldest to newest
    const modelsToTry = [
      "gemini-1.5-flash",      // Oldest, most stable
      "gemini-1.5-pro",        // Older pro version
      "gemini-2.0-flash",      // 2.0 flash
      "gemini-2.0-flash-001",  // 2.0 flash specific version
      "gemini-2.5-flash",      // Newest flash
      "gemini-2.5-pro",        // Newest pro
    ];

    // Extract base64 data (remove the data URL prefix)
    const base64 = image.split(",")[1];

    const imageParts = [
      {
        inlineData: {
          data: base64,
          mimeType: "image/jpeg",
        },
      },
    ];

    const prompt = `You are an expert dental hygiene assistant with years of clinical experience. Analyze this photo of the user's teeth and provide detailed, practical feedback in the following format:

1. PLAQUE AND TARTAR: Comment on visible plaque buildup, tartar (calculus), or staining. Be specific about which areas (front teeth, molars, gumline) show issues.

2. GUM HEALTH: Assess the gums - do they look swollen, red, inflamed, or receding? Are there signs of gingivitis or healthy pink gums?

3. BRUSHING EFFECTIVENESS: Based on what you see, provide feedback on their brushing technique. Are they missing certain areas? Do they need to focus more on gumline, back teeth, etc.?

4. SPECIFIC RECOMMENDATIONS: Give 2-3 actionable tips tailored to what you observe (e.g., "Focus on flossing between back molars" or "Use a softer touch near gumline").

5. POSITIVE REINFORCEMENT: Mention one thing they're doing well if applicable.

Keep your tone encouraging and educational. Do NOT diagnose specific diseases like cavities or periodontitis - instead say "possible signs of decay" or "consult a dentist if concerned." Write in clear, simple language that's easy to understand.`;

    let lastError = null;
    
    // Try each model in order until one works
    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model: ${modelName}`);
        
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const feedback = response.text();
        
        // If we get here, it worked!
        console.log(`✅ Success with model: ${modelName}`);
        return res.status(200).json({ 
          feedback,
          modelUsed: modelName 
        });
        
      } catch (modelError) {
        console.log(`❌ Model ${modelName} failed:`, modelError.message);
        lastError = modelError;
        // Continue to next model
      }
    }

    // If all models failed
    console.error("All models failed");
    throw lastError || new Error("No models available");

  } catch (err) {
    console.error("SCAN ERROR:", err);
    console.error("ERROR DETAILS:", err.message);
    res.status(500).json({ 
      error: "AI analysis failed", 
      details: err.message,
      note: "Tried multiple models, all failed"
    });
  }
}
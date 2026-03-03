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
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "No question provided" });
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

    const prompt = `You are a friendly and knowledgeable dental assistant. Answer the user's question about dental health, procedures, or finding a dentist. 

Question: ${query}

Provide a helpful, accurate response that:
- Uses simple language (avoid jargon unless you explain it)
- Gives practical advice
- Encourages professional dental visits when appropriate
- Is warm and encouraging

If you're unsure about something, say so honestly rather than guessing.`;

    let lastError = null;
    
    // Try each model in order until one works
    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model: ${modelName}`);
        
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const answer = response.text();
        
        console.log(`✅ Success with model: ${modelName}`);
        return res.status(200).json({ 
          answer,
          modelUsed: modelName 
        });
        
      } catch (modelError) {
        console.log(`❌ Model ${modelName} failed:`, modelError.message);
        lastError = modelError;
        // Continue to next model
      }
    }

    // If all models failed
    throw lastError || new Error("No models available");

  } catch (err) {
    console.error("ASSISTANT ERROR:", err);
    console.error("ERROR DETAILS:", err.message);
    res.status(500).json({ 
      error: "Failed to get answer", 
      details: err.message,
      note: "Tried multiple models, all failed"
    });
  }
}

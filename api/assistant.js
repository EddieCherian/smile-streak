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
    
    // Use gemini-2.5-flash (your preferred model)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a friendly and knowledgeable dental assistant. Answer the user's question about dental health, procedures, or finding a dentist. 

Question: ${query}

Provide a helpful, accurate response that:
- Uses simple language (avoid jargon unless you explain it)
- Gives practical advice
- Encourages professional dental visits when appropriate
- Is warm and encouraging
- Keep responses concise but informative (2-4 paragraphs max)

If you're unsure about something, say so honestly rather than guessing.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();
    
    return res.status(200).json({ 
      answer,
      modelUsed: "gemini-2.5-flash" 
    });

  } catch (err) {
    console.error("ASSISTANT ERROR:", err);
    console.error("ERROR DETAILS:", err.message);
    res.status(500).json({ 
      error: "Failed to get answer", 
      details: err.message
    });
  }
}
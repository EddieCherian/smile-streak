// api/scan.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Enable CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Initialize Gemini with your API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use gemini-2.5-flash (stable version that works)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Extract base64 data (remove the data URL prefix)
    const base64Data = image.includes(',') ? image.split(',')[1] : image;
    
    // Generate content with image
    const result = await model.generateContent([
      "You are a dental health assistant. Analyze this photo of teeth and provide feedback on: 1) Visible plaque or tartar 2) Gum health 3) Any obvious issues like cavities or staining 4) Overall dental hygiene tips. Be concise, helpful, and friendly. If you can't see teeth clearly, suggest retaking the photo with better lighting.",
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      }
    ]);
    
    const response = await result.response;
    const text = response.text();
    
    return res.status(200).json({ feedback: text });
    
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Handle specific API key errors
    if (error.message?.includes('API_KEY_HTTP_REFERRER_BLOCKED')) {
      return res.status(403).json({ 
        error: 'API key has referrer restrictions. Please remove HTTP referrer restrictions in Google Cloud Console.' 
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to analyze image. Please try again.' 
    });
  }
}
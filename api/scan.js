// Initialize Gemini with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use gemini-2.5-flash - it's available and supports images
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
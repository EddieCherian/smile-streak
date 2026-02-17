export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log("Fetching available models...");
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    
    const data = await response.json();
    
    console.log("Models response:", JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      console.error("Error fetching models:", data);
      return res.status(500).json({ error: "Failed to fetch models", details: data });
    }
    
    const modelNames = data.models?.map(m => m.name) || [];
    
    return res.status(200).json({ 
      message: "Available models",
      models: modelNames,
      fullData: data
    });

  } catch (err) {
    console.error("ERROR:", err);
    console.error("ERROR DETAILS:", err.message);
    res.status(500).json({ error: "Failed to list models", details: err.message });
  }
}

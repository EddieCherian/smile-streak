import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a dental hygiene assistant. Give short, practical feedback on brushing, gum health, plaque visibility, and technique. Do not diagnose disease. Be encouraging and concise."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this photo of teeth and give hygiene feedback."
            },
            {
              type: "image_url",
              image_url: {
                url: image
              }
            }
          ]
        }
      ],
      max_tokens: 200,
    });

    const feedback = response.choices[0].message.content;

    res.status(200).json({ feedback });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI analysis failed" });
  }
}

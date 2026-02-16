export const config = {
  api: {
    bodyParser: {
      sizeLimit: "6mb",
    },
  },
};

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "You are a dental hygiene assistant. Give short practical feedback on brushing, plaque visibility, and gum care. Do NOT diagnose disease.",
            },
            {
              type: "input_image",
              image_url: image,
            },
          ],
        },
      ],
      max_output_tokens: 200,
    });

    const feedback =
      response.output?.[0]?.content?.[0]?.text ||
      "AI returned no feedback";

    res.status(200).json({ feedback });

  } catch (err) {
    console.error("SCAN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
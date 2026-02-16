import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "6mb",
    },
  },
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "You are a dental hygiene assistant. Give short practical feedback on brushing, plaque visibility, and gum care. Do NOT diagnose disease."
            },
            {
              type: "input_image",
              image_url: image
            }
          ]
        }
      ],
      max_output_tokens: 200,
    });

    const feedback =
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text ||
      "No feedback returned";

    return res.status(200).json({ feedback });

  } catch (err) {
    console.error("SCAN ERROR:", err);
    return res.status(500).json({ error: "AI analysis failed" });
  }
}
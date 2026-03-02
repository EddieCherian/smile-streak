import axios from "axios";

const API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_KEY;

export async function translateText(text, targetLang = "en") {
  if (!text) return "";

  try {
    const res = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
      {
        q: text,
        target: targetLang,
        format: "text"
      }
    );

    return res.data.data.translations[0].translatedText;
  } catch (err) {
    console.error("Translate error:", err);
    return text; // fallback to original text
  }
}
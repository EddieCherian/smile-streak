import { useState } from "react";

export default function Scan() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setFeedback(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzePhoto = async () => {
    if (!image) return;

    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });

      const data = await res.json();
      setFeedback(data.feedback || data.error || "No response");
    } catch (err) {
      setFeedback("Failed to analyze image.");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Dental Scan</h2>

      <p className="text-sm text-gray-600">
        Take a photo of your teeth to get AI feedback on brushing and gum health.
      </p>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        className="block w-full text-sm"
      />

      {image && (
        <div className="space-y-4">
          <img
            src={image}
            alt="preview"
            className="rounded-xl border shadow"
          />

          <button
            onClick={analyzePhoto}
            disabled={loading}
            className="bg-cyan-500 text-white px-4 py-2 rounded-xl font-semibold"
          >
            {loading ? "Analyzing..." : "Analyze Photo"}
          </button>
        </div>
      )}

      {feedback && (
        <div className="bg-white border rounded-xl p-4 shadow text-sm">
          {feedback}
        </div>
      )}
    </div>
  );
}

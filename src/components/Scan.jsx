import { useState } from "react";

export default function Scan() {
  const [image, setImage] = useState(null);

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
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
          <button className="bg-cyan-500 text-white px-4 py-2 rounded-xl font-semibold">
            Analyze Photo
          </button>
        </div>
      )}
    </div>
  );
}

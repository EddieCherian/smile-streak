import { TIPS } from "../data";

export default function Tips() {
  return (
    <div className="space-y-4">
      {TIPS.map((tip) => (
        <div
          key={tip.id}
          className="bg-white p-5 rounded-3xl shadow-md"
        >
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">{tip.icon}</span>
            <h3 className="font-bold">{tip.title}</h3>
          </div>
          <p className="text-sm text-gray-600">{tip.content}</p>
          <p className="text-xs text-cyan-600 mt-2">
            Source: {tip.source}
          </p>
        </div>
      ))}
    </div>
  );
}

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
            Source:{" "}
            <a
              href={tip.source}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {tip.source}
            </a>
          </p>
        </div>
      ))}

      {/* ───────── Learn More Section ───────── */}
      <div className="bg-white p-6 rounded-3xl shadow-md mt-8">
        <h2 className="text-lg font-bold mb-3">Learn More</h2>
        <ul className="space-y-2 text-sm text-cyan-700">
          <li>
            <a
              href="https://www.ada.org/resources/research/science-and-research-institute/oral-health-topics"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              American Dental Association — Oral Health Topics
            </a>
          </li>
          <li>
            <a
              href="https://www.cdc.gov/oralhealth/basics/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              CDC — Oral Health Basics
            </a>
          </li>
          <li>
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/oral-health"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              World Health Organization — Oral Health Factsheet
            </a>
          </li>
        </ul>
      </div>

      {/* ───────── Disclaimer ───────── */}
      <div className="text-xs text-gray-500 mt-6 leading-relaxed">
        <strong>Important:</strong> These tips are for prevention and education
        only, based on published dental research. This app does not provide
        medical diagnosis or treatment recommendations. Always consult with a
        licensed dental professional for personalized advice, treatment, or if
        you have concerns about your oral health.
      </div>
    </div>
  );
}

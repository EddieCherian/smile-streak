export default function Tips() {
  const tips = [
    ["⏱️ Brush for 2 Minutes","American Dental Association (ADA)"],
    ["💧 Don't Rinse After Brushing","Journal of Dentistry, 2012"],
    ["🪥 Replace Your Toothbrush","ADA Clinical Guidelines"],
    ["🦷 Floss Before Brushing","Journal of Periodontology, 2018"],
    ["🍋 Wait After Acidic Foods","Journal of ADA, 2004"]
  ];

  return (
    <>
      <h2 className="section-title">Evidence-Based Dental Tips</h2>
      <p className="muted">
        Scientific guidance from dental research and organizations
      </p>

      {tips.map(([title, source]) => (
        <div key={title} className="tip-card">
          <strong>{title}</strong>
          <p className="source">ⓘ {source}</p>
        </div>
      ))}

      <div className="info-box">
        <strong>Important:</strong> These tips are for prevention and education
        only. Always consult a licensed dental professional.
      </div>
    </>
  );
}

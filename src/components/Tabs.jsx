import React from "react";

export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = ["Today", "Progress", "Tips", "Reminders"];

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <div
          key={tab}
          className={`tab ${activeTab === tab ? "active" : ""}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}

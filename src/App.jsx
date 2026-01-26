import React, { useState } from "react";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import Today from "./components/Today";
import Progress from "./components/Progress";
import Tips from "./components/Tips";
import Reminders from "./components/Reminders";

export default function App() {
  const [activeTab, setActiveTab] = useState("Today");

  const renderContent = () => {
    switch (activeTab) {
      case "Today":
        return <Today />;
      case "Progress":
        return <Progress />;
      case "Tips":
        return <Tips />;
      case "Reminders":
        return <Reminders />;
      default:
        return <Today />;
    }
  };

  return (
    <div className="app">
      <Header />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="tab-content">{renderContent()}</div>
    </div>
  );
}

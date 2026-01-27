export default function NavTabs({ activeTab, setActiveTab }) {
  const tabs = ["Today", "Progress", "Tips", "Reminders", "Dentists", "Insights", "Mission"];

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab.toLowerCase())}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition
            ${
              activeTab === tab.toLowerCase()
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

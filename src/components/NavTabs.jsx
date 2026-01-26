export default function NavTabs({ activeTab, setActiveTab }) {
  const tabs = ["Today", "Progress", "Tips", "Reminders"];

  return (
    <div className="flex gap-2 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-full text-sm ${
            activeTab === tab
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

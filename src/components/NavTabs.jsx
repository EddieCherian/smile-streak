export default function NavTabs({ activeTab, setActiveTab }) {
  const tabs = [
    "Home",
    "Today",
    "Progress",
    "Tips",
    "Reminders",
    "Scan",
    "Dentists",
    "Report",
    "Insights",
    "Mission",
    "Legal"
  ];

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-2 px-2">
        {tabs.map((tab) => {
          const value = tab.toLowerCase();
          const active = activeTab === value;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(value)}
              className={`
                px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap
                transition-all duration-200
                ${
                  active
                    ? "bg-blue-600 text-white shadow-md scale-[1.02]"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }
              `}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
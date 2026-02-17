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
    <div className="w-full overflow-x-auto pb-3">
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
                transition-all duration-200 border
                ${
                  active
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md border-transparent scale-[1.03]"
                    : "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-100 hover:from-blue-100 hover:to-cyan-100"
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
import { Home, Briefcase, FileText, User, Settings } from "lucide-react";

export function MobileTabBar() {
  const tabs = [
    { icon: Home, label: "Inicio", active: false },
    { icon: Briefcase, label: "Vacantes", active: true },
    { icon: FileText, label: "Postulaciones", active: false },
    { icon: User, label: "Perfil", active: false },
    { icon: Settings, label: "Más", active: false },
  ];

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white flex items-center justify-around px-2 z-50"
      style={{
        borderTop: "1px solid #E2E8F0",
        height: "64px",
        paddingBottom: "env(safe-area-inset-bottom)"
      }}
    >
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        return (
          <button
            key={index}
            className="flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] flex-1"
          >
            <Icon
              className="w-5 h-5"
              style={{ color: tab.active ? "#1A4FBD" : "#64748B" }}
              strokeWidth={2}
            />
            <span
              className="text-[10px] font-medium"
              style={{
                color: tab.active ? "#1A4FBD" : "#64748B",
                fontFamily: "'Inter', sans-serif"
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

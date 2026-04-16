import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function FilterChips() {
  const [activeFilter, setActiveFilter] = useState("Todas");

  const filters = [
    { label: "Todas", count: 20, badge: null },
    { label: "Match alto", count: null, badge: null },
    { label: "Match medio", count: null, badge: null },
    { label: "Aspiracionales", count: null, badge: null },
    { label: "Nuevas hoy", count: null, badge: 3 },
    { label: "Guardadas", count: null, badge: null },
  ];

  return (
    <div
      className="bg-white px-4 lg:px-6 py-3"
      style={{ borderBottom: "1px solid #F7F9FC" }}
    >
      <div className="flex items-center justify-between gap-2 lg:gap-4">
        {/* Filter Chips */}
        <div
          className="flex items-center gap-2 overflow-x-auto flex-1 -mx-1 px-1"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {filters.map((filter, index) => (
            <button
              key={index}
              onClick={() => setActiveFilter(filter.label)}
              className={`flex items-center gap-1.5 px-3 lg:px-4 rounded-lg whitespace-nowrap text-xs lg:text-sm font-medium transition-all flex-shrink-0 min-h-[44px] ${
                activeFilter === filter.label
                  ? "text-white"
                  : "bg-white hover:border-[#1A4FBD]"
              }`}
              style={
                activeFilter === filter.label
                  ? { backgroundColor: "#1A4FBD" }
                  : { border: "1px solid #E2E8F0", color: "#64748B" }
              }
            >
              {filter.label}
              {filter.count !== null && (
                <span className={activeFilter === filter.label ? "text-white/80" : ""}>
                  ({filter.count})
                </span>
              )}
              {filter.badge !== null && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold text-white"
                  style={{ backgroundColor: "#EF4444" }}
                >
                  {filter.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Sort Dropdown - Hidden on mobile */}
        <button
          className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium hover:bg-[#F7F9FC] transition-colors flex-shrink-0"
          style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}
        >
          Ordenar por: <span style={{ color: "#0F172A" }}>Relevancia</span>
          <ChevronDown className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

import { Bell } from "lucide-react";

export function TopHeader() {
  return (
    <div
      className="bg-white px-4 lg:px-6 py-4 lg:py-5"
      style={{ borderBottom: "1px solid #E2E8F0" }}
    >
      <div className="flex items-center justify-between">
        {/* Left Side - Title */}
        <div>
          <h1
            className="text-xl lg:text-2xl mb-0.5"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              color: "#0F172A"
            }}
          >
            Vacantes para ti
          </h1>
          <p
            className="text-xs lg:text-sm"
            style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}
          >
            12 nuevas vacantes hoy
          </p>
        </div>

        {/* Right Side - Notification & Avatar */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Notification Bell */}
          <button className="relative p-2 hover:bg-[#F7F9FC] rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <Bell className="w-5 h-5" style={{ color: "#64748B" }} strokeWidth={2} />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: "#EF4444" }}
            />
          </button>

          {/* User Avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
            style={{ backgroundColor: "#1A4FBD" }}
          >
            JD
          </div>
        </div>
      </div>
    </div>
  );
}

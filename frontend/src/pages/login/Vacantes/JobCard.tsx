import { Bookmark } from "lucide-react";

interface JobCardProps {
  company: string;
  companyInitials: string;
  companyColor: string;
  title: string;
  location: string;
  modality: string;
  matchPercent: number;
  matchType: "high" | "medium" | "aspirational";
  skills: string[];
  salaryRange: string;
  isNew?: boolean;
  isApplied?: boolean;
  isAspirational?: boolean;
  missingSkills?: number;
}

export function JobCard({
  company,
  companyInitials,
  companyColor,
  title,
  location,
  modality,
  matchPercent,
  matchType,
  skills,
  salaryRange,
  isNew = false,
  isApplied = false,
  isAspirational = false,
  missingSkills = 0,
}: JobCardProps) {
  const matchBadgeStyles = {
    high: { bg: "#DCFCE7", text: "#15803D" },
    medium: { bg: "#FEF9C3", text: "#854D0E" },
    aspirational: { bg: "#EEF2FF", text: "#4F46E5" },
  };

  const badgeStyle = matchBadgeStyles[matchType];

  return (
    <div
      className="bg-white rounded-[14px] p-5 transition-shadow hover:shadow-md"
      style={{
        border: "0.5px solid #E2E8F0",
        borderLeft: isAspirational ? "3px solid #4F46E5" : "0.5px solid #E2E8F0"
      }}
    >
      {/* Header Row */}
      <div className="flex gap-3 mb-3">
        {/* Company Logo */}
        <div
          className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
          style={{ backgroundColor: companyColor, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {companyInitials}
        </div>

        {/* Title & Company Info */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-[15px] mb-1 leading-tight"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              color: "#0F172A"
            }}
          >
            {title}
          </h3>
          <p
            className="text-[13px] leading-tight"
            style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}
          >
            {company} • {location} • {modality}
          </p>
        </div>

        {/* Right Side Badges */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {/* Match Badge */}
          <span
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
            style={{
              backgroundColor: badgeStyle.bg,
              color: badgeStyle.text,
              fontFamily: "'Inter', sans-serif"
            }}
          >
            {matchPercent}% match
          </span>

          {/* New Badge */}
          {isNew && (
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
              style={{ backgroundColor: "#EF4444", fontFamily: "'Inter', sans-serif" }}
            >
              Nueva
            </span>
          )}
        </div>
      </div>

      {/* Aspirational Banner */}
      {isAspirational && (
        <div
          className="rounded-lg px-3 py-2 mb-3 text-[12px] leading-snug"
          style={{
            backgroundColor: "#EEF2FF",
            color: "#4F46E5",
            fontFamily: "'Inter', sans-serif"
          }}
        >
          Vacante aspiracional — te faltan {missingSkills} skills para aplicar.{" "}
          <button className="font-semibold hover:underline">
            Ver qué mejorar →
          </button>
        </div>
      )}

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-2.5 py-1 rounded-md text-[11px] font-medium"
            style={{
              backgroundColor: "#F1F5F9",
              color: "#64748B",
              fontFamily: "'Inter', sans-serif"
            }}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: "1px solid #F8FAFC", marginTop: "12px" }}
      >
        {/* Salary */}
        <div>
          <p
            className="text-[11px] mb-0.5"
            style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}
          >
            Salario
          </p>
          <p
            className="text-[13px] font-semibold"
            style={{ color: "#0F172A", fontFamily: "'Inter', sans-serif" }}
          >
            {salaryRange}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-[#F7F9FC]"
            style={{ borderColor: "#E2E8F0" }}
          >
            <Bookmark className="w-4 h-4" style={{ color: "#64748B" }} strokeWidth={2} />
          </button>

          {/* Apply Button */}
          {isApplied ? (
            <button
              className="px-4 h-8 rounded-lg text-[13px] font-semibold flex items-center gap-1"
              style={{
                backgroundColor: "#DCFCE7",
                color: "#15803D",
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Enviada ✓
            </button>
          ) : isAspirational ? (
            <button
              className="px-4 h-8 rounded-lg text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "#4F46E5",
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Ver qué me falta
            </button>
          ) : (
            <button
              className="px-4 h-8 rounded-lg text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "#1A4FBD",
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Aplicar 1 clic
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

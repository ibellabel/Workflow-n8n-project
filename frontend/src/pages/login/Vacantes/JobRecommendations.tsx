import { Sidebar } from "./SideBar";
import { TopHeader } from "./TopHeader";
import { FilterChips } from "./FilterChips";
import { JobCard } from "./JobCard";
import { MobileTabBar } from "./mobiletabBar";

export function JobRecommendations() {
  const jobs = [
    {
      company: "Nubank",
      companyInitials: "NU",
      companyColor: "#8A05BE",
      title: "Desarrollador Backend Senior",
      location: "Bogotá",
      modality: "Remoto",
      matchPercent: 92,
      matchType: "high" as const,
      skills: ["Node.js", "PostgreSQL", "AWS"],
      salaryRange: "$6.000 – $9.000 USD/mes",
      isNew: true,
    },
    {
      company: "Rappi",
      companyInitials: "RP",
      companyColor: "#FF441F",
      title: "Ingeniero Full Stack",
      location: "Medellín",
      modality: "Híbrido",
      matchPercent: 87,
      matchType: "high" as const,
      skills: ["React", "Python", "Docker", "GraphQL"],
      salaryRange: "$4.500 – $7.000 USD/mes",
      isNew: true,
    },
    {
      company: "Bancolombia",
      companyInitials: "BC",
      companyColor: "#FFDD00",
      title: "Analista de Datos Sr",
      location: "Bogotá",
      modality: "Presencial",
      matchPercent: 74,
      matchType: "medium" as const,
      skills: ["SQL", "Python", "Power BI"],
      salaryRange: "$3.000 – $5.000 USD/mes",
    },
    {
      company: "Grupo Éxito",
      companyInitials: "GE",
      companyColor: "#E30613",
      title: "Frontend Developer",
      location: "Cali",
      modality: "Híbrido",
      matchPercent: 69,
      matchType: "medium" as const,
      skills: ["React", "TypeScript", "CSS", "Figma"],
      salaryRange: "$2.500 – $4.000 USD/mes",
      isNew: true,
    },
    {
      company: "Mercado Libre",
      companyInitials: "ML",
      companyColor: "#FFE600",
      title: "Staff Engineer",
      location: "Remoto",
      modality: "Remoto",
      matchPercent: 58,
      matchType: "aspirational" as const,
      skills: ["Go", "Kubernetes", "System Design"],
      salaryRange: "$12.000+ USD/mes",
      isAspirational: true,
      missingSkills: 2,
    },
    {
      company: "Globant",
      companyInitials: "GL",
      companyColor: "#BEDB39",
      title: "Tech Lead",
      location: "Bogotá",
      modality: "Híbrido",
      matchPercent: 52,
      matchType: "aspirational" as const,
      skills: ["Leadership", "Architecture", "Java", "Microservices"],
      salaryRange: "$10.000 – $15.000 USD/mes",
      isAspirational: true,
      missingSkills: 2,
    },
  ];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F7F9FC" }}>
      {/* Sidebar - Desktop Only */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Top Header */}
        <TopHeader />

        {/* Filter Chips */}
        <FilterChips />

        {/* Job Cards Grid */}
        <div className="flex-1 px-4 lg:px-6 py-4 lg:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {jobs.map((job, index) => (
              <JobCard key={index} {...job} />
            ))}
          </div>

          {/* Load More Section */}
          <div className="flex flex-col items-center gap-3 pb-4">
            <button
              className="px-6 rounded-lg text-sm font-semibold transition-colors hover:bg-[#F7F9FC] min-h-[44px]"
              style={{
                border: "1px solid #E2E8F0",
                color: "#1A4FBD",
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Cargar más vacantes
            </button>
            <p
              className="text-sm"
              style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}
            >
              Mostrando 6 de 20 vacantes
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar - Mobile Only */}
      <MobileTabBar />
    </div>
  );
}

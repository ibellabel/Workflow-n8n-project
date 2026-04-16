export function ScorePreviewCard() {
  return (
    <div 
      className="rounded-[16px] p-6" 
      style={{ 
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.15)"
      }}
    >
      <div className="flex items-start gap-4">
        {/* Circular Score Badge */}
        <div className="relative flex-shrink-0">
          <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="6"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#4CC9A4"
              strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - 0.78)}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white font-bold text-xl leading-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              78
            </span>
            <span className="text-white/70 text-xs">/100</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base mb-2 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Tu perfil vs. Desarrollador Senior
          </h3>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: "78%",
                background: "linear-gradient(90deg, #4CC9A4 0%, #3EB89A 100%)"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

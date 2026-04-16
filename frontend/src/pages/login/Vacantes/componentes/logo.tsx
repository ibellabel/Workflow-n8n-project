import * as React from "react";
import { MapPin, Check } from "lucide-react";

interface LogoProps {
  variant?: "default" | "compact";
  showText?: boolean;
}

export function Logo({ variant = "default", showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12 bg-[#1A4FBD] rounded-[10px] flex items-center justify-center">
        <div className="relative w-6 h-6">
          <MapPin className="w-6 h-6 text-white absolute inset-0" strokeWidth={2} />
          <Check className="w-3.5 h-3.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" strokeWidth={3} />
        </div>
      </div>
      {showText && (
        <div className={variant === "compact" ? "hidden sm:block" : ""}>
          <h1 className="text-white font-bold text-xl leading-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            HireMatch
          </h1>
        </div>
      )}
    </div>
  );
}

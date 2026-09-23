import React, { useState } from "react";
import { Building2, Phone, Mail, ArrowRight, MapPin, Globe } from "lucide-react";
import { OFFICES_DATA, OfficeInfo } from "../data/siteData";
import { DottedGlobe } from "@/components/ui/wireframe-dotted-globe";
import ExpandedOfficeMap from "@/components/ui/expanded-office-map";

interface OfficesSectionProps {
  onGetInTouch: (officeName: string) => void;
}

export default function OfficesSection({ onGetInTouch }: OfficesSectionProps) {
  const [activeOfficeId, setActiveOfficeId] = useState<string>("kolkata");
  const [mapExpanded, setMapExpanded] = useState<boolean>(false);

  const activeOffice =
    OFFICES_DATA.find((o) => o.id === activeOfficeId) || OFFICES_DATA[0];

  return (
    <section id="offices" className="py-24 md:py-36 bg-black relative border-t border-white/6 overflow-hidden">
      <div className="max-w-[1120px] mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column (5 columns out of 12 for high fidelity) */}
          <div className="lg:col-span-5 flex flex-col items-start text-left z-10">
            <h2 className="text-[38px] sm:text-[48px] md:text-[54px] font-bold tracking-[-0.03em] leading-[1.12] mb-5 gold-gradient-heading">
              Come visit us at
              <br />
              our office
            </h2>

            <p className="text-[15px] sm:text-[16px] text-neutral-400 leading-[1.65] max-w-[500px] mb-8">
              Meet our investment directors and portfolio managers at our headquarters in Kolkata’s premier business district.
            </p>

            {/* Address Card */}
            <div className="w-full rounded-2xl bg-[#0f0f12] border border-white/8 p-6 md:p-7 shadow-xl mb-8 relative group">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-[#e2d6a0] text-[11px] font-bold tracking-widest uppercase">
                  <Building2 className="w-4 h-4" />
                  <span>KOLKATA OFFICE</span>
                </div>

                {/* Principal Registered Office Pill Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e2d6a0]/30 bg-[#e2d6a0]/5 text-[10px] font-semibold text-[#e2d6a0] tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e2d6a0]" />
                  <span>Principal Registered Office</span>
                </div>
              </div>

              {/* Address label and text */}
              <div className="mb-6">
                <span className="text-[10px] tracking-widest uppercase font-bold text-neutral-500 block mb-1.5">ADDRESS</span>
                <p className="whitespace-pre-line text-[14px] text-white leading-relaxed font-medium">
                  {activeOffice.address}
                </p>
              </div>

              {/* Contact Details */}
              <div className="pt-4 border-t border-white/8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-neutral-300 mb-5">
                <a
                  href={`tel:${activeOffice.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-2 hover:text-[#e2d6a0] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{activeOffice.phone}</span>
                </a>
                <a
                  href={`mailto:${activeOffice.email}`}
                  className="flex items-center gap-2 hover:text-[#e2d6a0] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{activeOffice.email}</span>
                </a>
              </div>

              {/* Quick Map Action Footer */}
              <button
                onClick={() => setMapExpanded(true)}
                className="text-[12px] text-[#e2d6a0] hover:underline flex items-center gap-1.5 transition-all cursor-pointer font-semibold"
              >
                <MapPin className="w-4 h-4" />
                <span>Explore zoomed-in street map (or click anywhere on globe) ↗</span>
              </button>
            </div>

            {/* GET IN TOUCH Gold Gradient Button */}
            <button
              onClick={() => onGetInTouch(activeOffice.name)}
              className="h-12 px-8 rounded-full bg-gradient-to-r from-[#e2d6a0] to-[#f1e7b4] text-black font-bold text-xs tracking-widest uppercase hover:opacity-90 transition-all flex items-center gap-2 shadow-lg group cursor-pointer"
            >
              <span>GET IN TOUCH</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Column (Expanded to 7 columns out of 12 for the Globe) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center w-full">
            <div className="w-full relative min-h-[520px] md:min-h-[560px] rounded-[24px] bg-black border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
              {/* Background faint dot pattern */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* View Street Map Float Button overlay on Globe view */}
              {!mapExpanded && (
                <button
                  onClick={() => setMapExpanded(true)}
                  className="absolute top-6 right-6 z-20 px-4 py-2 rounded-full bg-neutral-900/85 border border-white/10 hover:border-[#e2d6a0]/30 text-[11px] font-semibold text-neutral-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-md"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#e2d6a0]" />
                  <span>View Street Map ↗</span>
                </button>
              )}

              {/* Globe View with Fade/Scale */}
              <div
                className={`w-full h-full flex items-center justify-center transition-all duration-300 ${
                  mapExpanded
                    ? "opacity-0 scale-95 pointer-events-none absolute inset-0"
                    : "opacity-100 scale-100 relative"
                }`}
              >
                <DottedGlobe
                  width={680}
                  height={560}
                  className="w-full"
                  colors={{
                    dot: "255,255,255",
                    landLine: "rgba(255,255,255,0.55)",
                    graticule: "rgba(255,255,255,0.13)",
                    rim: "rgba(255,255,255,0.55)",
                  }}
                  paused={mapExpanded}
                  onMarkerClick={() => {
                    setMapExpanded(true);
                  }}
                />
              </div>

              {/* Expanded Map View with 200-400ms Transition */}
              <div
                className={`w-full h-full transition-all duration-300 ${
                  mapExpanded
                    ? "opacity-100 scale-100 relative"
                    : "opacity-0 scale-95 pointer-events-none absolute inset-0"
                }`}
              >
                {mapExpanded && (
                  <ExpandedOfficeMap
                    onClose={() => setMapExpanded(false)}
                    className="w-full h-full"
                  />
                )}
              </div>
            </div>

            {/* Click Anywhere on Globe Prompt underneath */}
            {!mapExpanded && (
              <div
                onClick={() => setMapExpanded(true)}
                className="text-[11px] text-neutral-400 font-medium tracking-wide flex items-center gap-2 justify-center mt-4 transition-all hover:text-[#f1e7b4] cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#e2d6a0] animate-pulse" />
                <span>Click anywhere on the 3D globe to expand interactive street map ↗</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

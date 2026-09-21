import React, { useState } from "react";
import { Building2, Phone, Mail, ArrowRight, MapPin, Globe } from "lucide-react";
import { OFFICES_DATA, OfficeInfo } from "../data/siteData";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";
import ExpandedOfficeMap from "@/components/ui/expanded-office-map";

interface OfficesSectionProps {
  onGetInTouch: (officeName: string) => void;
}

export default function OfficesSection({ onGetInTouch }: OfficesSectionProps) {
  const [mapExpanded, setMapExpanded] = useState<boolean>(false);

  const activeOffice = OFFICES_DATA[0];

  return (
    <section id="offices" className="py-24 md:py-36 bg-black relative border-t border-white/6 overflow-hidden">
      <div className="max-w-[1120px] mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column (50%) */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
            <h2 className="text-[38px] sm:text-[48px] md:text-[54px] font-bold tracking-[-0.03em] leading-[1.12] mb-5 gold-gradient-heading">
              Come visit us at
              <br />
              our registered office
            </h2>

            <p className="text-[15px] sm:text-[16px] text-neutral-400 leading-[1.65] max-w-[500px] mb-8">
              Meet our investment directors and portfolio managers in our private advisory suite in Kolkata.
            </p>

            {/* Address Card */}
            <div className="w-full rounded-2xl bg-[#0f0f12] border border-white/8 p-6 md:p-7 shadow-xl mb-8 relative group">
              {/* Green Caps Eyebrow */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#34d399] text-[11px] font-bold tracking-widest uppercase">
                  <Building2 className="w-4 h-4" />
                  <span>{activeOffice.suiteTitle}</span>
                </div>

                {/* Quick Map Action */}
                <button
                  onClick={() => setMapExpanded(true)}
                  className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Map</span>
                </button>
              </div>

              {/* Address */}
              <p className="text-[14px] text-white leading-relaxed font-medium mb-6">
                {activeOffice.address}
              </p>

              {/* Contact Details */}
              <div className="pt-4 border-t border-white/8 flex flex-wrap items-center gap-6 text-[13px] text-neutral-300">
                <a
                  href={`tel:${activeOffice.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{activeOffice.phone}</span>
                </a>
                <a
                  href={`mailto:${activeOffice.email}`}
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{activeOffice.email}</span>
                </a>
              </div>
            </div>

            {/* GET IN TOUCH CTA Button */}
            <button
              onClick={() => onGetInTouch(activeOffice.name)}
              className="h-12 px-8 rounded-full bg-white text-black font-bold text-xs tracking-widest uppercase hover:bg-neutral-100 transition-all flex items-center gap-2 shadow-lg group cursor-pointer"
            >
              <span>GET IN TOUCH</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Column (50%): Dotted Rotating Globe OR Expanded MapLibre Map */}
          <div className="lg:col-span-6 flex justify-center items-center w-full">
            <div className="w-full relative min-h-[520px] md:min-h-[560px] rounded-[24px] bg-[#0c0c0e] border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
              {/* Background faint dot pattern */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Globe View with Fade/Scale */}
              <div
                className={`w-full h-full flex items-center justify-center transition-all duration-300 ${
                  mapExpanded
                    ? "opacity-0 scale-95 pointer-events-none absolute inset-0"
                    : "opacity-100 scale-100 relative"
                }`}
              >
                <RotatingEarth
                  width={620}
                  height={540}
                  className="w-full"
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
          </div>
        </div>
      </div>
    </section>
  );
}

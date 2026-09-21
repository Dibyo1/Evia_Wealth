import React, { useState } from "react";
import { Plus, X, ArrowRight } from "lucide-react";
import { TEAM_MEMBERS, TeamMember } from "../data/siteData";

export default function TeamSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleMember = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="team" className="pt-20 pb-28 md:pb-36 bg-black relative border-t border-white/6">
      {/* Sticky Section Heading behind the expert rows */}
      <div className="sticky top-[85px] z-0 text-center max-w-[700px] mx-auto mb-14 px-5 pointer-events-none">
        <h2 className="text-[40px] sm:text-[50px] md:text-[58px] font-bold tracking-[-0.03em] leading-[1.12] gold-gradient-heading">
          Meet our team
          <br />
          of experts
        </h2>
      </div>

      {/* Narrow Accordion Container (≈ 640px) that rises up over the background */}
      <div className="relative z-10 max-w-[640px] mx-auto px-5 sm:px-6 space-y-3.5">
          {TEAM_MEMBERS.map((member) => {
            const isExpanded = expandedId === member.id;

            if (isExpanded) {
              return (
                /* Expanded White Detail Card */
                <div
                  key={member.id}
                  className="rounded-[28px] bg-white text-[#0a0a0a] p-6 sm:p-8 shadow-2xl border border-neutral-200 transition-all duration-300 animate-in fade-in zoom-in-95"
                >
                  {/* Top Row with Close Button */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-full object-cover border-2 border-neutral-100 shadow-md"
                      />
                      <div>
                        <h3 className="text-[22px] sm:text-[26px] font-black text-black tracking-tight leading-tight">
                          {member.name}
                        </h3>
                        <p className="text-[13px] text-neutral-600 font-medium">
                          {member.fullRole}
                        </p>
                        {/* LinkedIn Icon */}
                        <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-blue-50 text-[#0a66c2] text-[10px] font-bold">
                          in <span className="text-neutral-500 font-normal">Verified</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleMember(member.id)}
                      className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                      title="Close details"
                      aria-label="Close details"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 2x2 Grid of Facts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 mb-6">
                    {member.facts.map((fact, fIdx) => (
                      <div key={fIdx} className="space-y-1">
                        <div className="text-[11px] text-neutral-500 font-medium">
                          {fact.label}
                        </div>
                        <div className="text-[16px] sm:text-[18px] font-extrabold text-black tracking-tight leading-snug">
                          {fact.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bio Paragraph */}
                  <div className="text-[12px] sm:text-[13px] text-neutral-600 leading-[1.65] border-t border-neutral-200/80 pt-4">
                    {member.bio}
                  </div>
                </div>
              );
            }

            return (
              /* Collapsed Dark Row */
              <button
                key={member.id}
                onClick={() => toggleMember(member.id)}
                className="w-full text-left rounded-2xl bg-[#0f0f12] hover:bg-[#151518] border border-white/8 hover:border-white/15 p-4 sm:p-5 flex items-center justify-between transition-all group cursor-pointer shadow-md"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[350ms] border border-white/10"
                  />
                  <div>
                    <h3 className="text-[15px] sm:text-[16px] font-semibold text-white group-hover:text-[#ebe0a6] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-[12px] text-neutral-400">
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/10 text-neutral-400 group-hover:text-white flex items-center justify-center transition-all">
                  <Plus className="w-4 h-4" />
                </div>
              </button>
            );
          })}

          {/* Final Row: "See all members →" */}
          <div className="w-full rounded-2xl bg-[#0f0f12] border border-white/8 p-4 sm:p-5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-black object-cover grayscale"
                  referrerPolicy="no-referrer"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Team member"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-black object-cover grayscale"
                  referrerPolicy="no-referrer"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                  alt="Team member"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-black object-cover grayscale"
                  referrerPolicy="no-referrer"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
                  alt="Team member"
                />
              </div>
              <span className="text-[13px] text-neutral-400 font-medium">
                Research & quant council
              </span>
            </div>

            <button
              onClick={() => {
                // Open first member if none open
                if (!expandedId) setExpandedId(TEAM_MEMBERS[0].id);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>See all members</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
    </section>
  );
}

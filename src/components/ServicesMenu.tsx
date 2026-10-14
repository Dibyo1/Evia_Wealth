import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FileText, Building2, ExternalLink, ChevronRight } from "lucide-react";
import { useNavigation } from "../context/NavigationContext";

const CLOSE_DELAY_MS = 150;

const Chevron = ({ dir, className = "" }: { dir: "down" | "right"; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    {dir === "down" ? <path d="m6 9 6 6 6-6" /> : <path d="m9 6 6 6-6 6" />}
  </svg>
);

export default function ServicesMenu() {
  const { navigate, isAmcsEmpanelled, isCommissionDisclosure, openDisclosureModal } = useNavigation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const openMenu = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }, []);

  // Close on outside pointer-down (covers touch) and on Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => () => cancelClose(), []);

  const handleDisclosureClick = () => {
    setOpen(false);
    openDisclosureModal();
  };

  const handleAmcsClick = () => {
    setOpen(false);
    navigate("/amcs-empanelled");
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            openMenu();
          }
        }}
        className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
          isAmcsEmpanelled || isCommissionDisclosure ? "text-[#f6e7b4] font-semibold" : "text-[#e6d78a] hover:text-[#f1e7b4]"
        }`}
      >
        <span>Services</span>
        <Chevron
          dir="down"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 top-full z-[60] pt-3"
          >
            <div
              role="menu"
              className="w-[320px] overflow-hidden rounded-2xl border border-[rgba(212,175,55,.35)] bg-[#0b0b0b]/95 shadow-[0_24px_60px_-12px_rgba(0,0,0,.8),0_0_0_1px_rgba(212,175,55,.06)] backdrop-blur-xl p-2.5"
            >
              <div className="px-3 pt-1 pb-2">
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#d9c56e]/80">
                  Regulatory & Partners
                </span>
              </div>

              <div className="space-y-1">
                {/* 1. Commission Disclosure (Opens Interactive PDF Viewer Modal & Download) */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleDisclosureClick}
                  className="group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left transition-all cursor-pointer text-[#cfc7a0]/80 hover:text-[#f1e7b4] hover:bg-[rgba(212,175,55,0.14)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] text-[#e6d78a] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-[rgba(212,175,55,0.4)] transition-all">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[14px] font-medium text-[#f1e7b4] group-hover:text-white transition-colors flex items-center gap-1.5">
                        <span>Commission Disclosure</span>
                        <span className="text-[9.5px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[rgba(212,175,55,0.2)] text-[#f1e7b4] border border-[rgba(212,175,55,0.35)]">
                          PDF
                        </span>
                      </div>
                      <span className="text-[11.5px] text-[#cfc7a0]/60 block leading-tight mt-0.5">
                        View & download exact PDF
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#d4af37]" />
                </button>

                {/* 2. List of AMCs Empanelled Page */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleAmcsClick}
                  className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left transition-all cursor-pointer ${
                    isAmcsEmpanelled
                      ? "bg-[rgba(212,175,55,0.14)] text-[#f1e7b4] font-medium"
                      : "text-[#cfc7a0]/80 hover:text-[#f1e7b4] hover:bg-[rgba(212,175,55,0.14)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      isAmcsEmpanelled
                        ? "bg-[rgba(212,175,55,0.2)] border border-[rgba(212,175,55,0.45)] text-[#f6e7b4]"
                        : "bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] text-[#e6d78a] group-hover:scale-105 group-hover:border-[rgba(212,175,55,0.4)]"
                    }`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[14px] font-medium text-[#f1e7b4] group-hover:text-white transition-colors flex items-center gap-2">
                        {isAmcsEmpanelled && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d4c06e] shadow-[0_0_6px_#d4c06e]" />
                        )}
                        <span>List of AMCs Empanelled</span>
                      </div>
                      <span className="text-[11.5px] text-[#cfc7a0]/60 block leading-tight mt-0.5">
                        View all 43 partner AMCs
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-all ${
                    isAmcsEmpanelled
                      ? "opacity-100 text-[#d4af37]"
                      : "opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 text-[#d4af37]"
                  }`} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

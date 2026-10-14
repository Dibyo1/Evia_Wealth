import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigation } from "../context/NavigationContext";

export type SolutionItem = { title: string; description?: string; href?: string };
export type SolutionCategory = { id: string; label: string; href: string; solutions: SolutionItem[] };

export const SOLUTIONS_MENU: SolutionCategory[] = [
  {
    id: "investment-products",
    label: "Investment Products",
    href: "/solutions/investment-products",
    solutions: [
      { title: "Equities", description: "High-conviction direct equity portfolios based on bottom-up research", href: "/solutions/investment-products" },
      { title: "Fixed Income", description: "Bespoke cash-flow alignment and tailored yield instruments", href: "/solutions/investment-products" },
      { title: "Mutual Funds", description: "Curated active, passive, and smart-beta fund strategies", href: "/solutions/investment-products" },
      { title: "Alternative Investments", description: "Private equity, venture capital, and private debt access", href: "/solutions/investment-products" },
      { title: "Structured Products", description: "Custom payoff profiles with capital protection structures", href: "/solutions/investment-products" },
      { title: "Derivatives", description: "Quantitative hedging and opportunistic exposures", href: "/solutions/investment-products" },
      { title: "Execution & Depository Services", description: "End-to-end seamless execution and custody platform", href: "/solutions/investment-products" },
    ],
  },
  {
    id: "wealth-planning",
    label: "Wealth Planning",
    href: "/solutions/wealth-planning",
    solutions: [
      { title: "Wealth Transmission & Succession", description: "Wills, private trusts, and generational legacy transfer", href: "/solutions/wealth-planning" },
      { title: "Wealth Protection & Preservation", description: "Ring-fencing estate assets from liabilities and risks", href: "/solutions/wealth-planning" },
      { title: "Family & Business", description: "Governance frameworks, family constitutions & boards", href: "/solutions/wealth-planning" },
      { title: "Philanthropy Services", description: "Impactful giving vehicles and structured family CSR", href: "/solutions/wealth-planning" },
    ],
  },
  {
    id: "real-estate",
    label: "Real Estate",
    href: "/solutions/real-estate",
    solutions: [
      { title: "Real Estate Aggregation Platform (REAP)", description: "Integrated private office platform in collaboration with Props AMC", href: "/solutions/real-estate" },
      { title: "Financial Investments in Real Estate", description: "REITs, InvITs, NCDs, and structured real estate funds", href: "/solutions/real-estate" },
      { title: "Residential Real Estate", description: "Curated primary, secondary, and distressed opportunities", href: "/solutions/real-estate" },
      { title: "Pre-Lease Options", description: "High-yield commercial, warehousing, and healthcare assets", href: "/solutions/real-estate" },
      { title: "Fundraising & Structured Financing", description: "LAP, LRD, structured buybacks, and debt instruments", href: "/solutions/real-estate" },
      { title: "Opportunities in Emerging Sectors", description: "Student housing, co-living, senior living & logistics", href: "/solutions/real-estate" },
      { title: "International Opportunities", description: "Cross-border real estate acquisitions and partnerships", href: "/solutions/real-estate" },
    ],
  },
  {
    id: "lending-solutions",
    label: "Lending Solutions",
    href: "/solutions/lending-solutions",
    solutions: [
      { title: "Loan against Securities", description: "Instant cash liquidity without breaking compound compounding cycles", href: "/solutions/lending-solutions" },
      { title: "Personal Loan", description: "Bespoke confidential credit lines for high-net-worth individuals", href: "/solutions/lending-solutions" },
      { title: "Home Loan", description: "Institutional mortgage advisory for luxury homes and properties", href: "/solutions/lending-solutions" },
    ],
  },
];

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

export default function SolutionsMenu({ categories = SOLUTIONS_MENU }: { categories?: SolutionCategory[] }) {
  const { navigate, activeSolutionId } = useNavigation();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(categories[0]?.id);
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

  // Close on outside pointer-down (covers touch) and on Escape.
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

  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  const [clickedId, setClickedId] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    setClickedId(categoryId);
    // Brief immediate click feedback (~80ms), then close dropdown and navigate
    setTimeout(() => {
      setOpen(false);
      setClickedId(null);
      navigate(`/solutions/${categoryId}`);
    }, 80);
  };

  const onListKeyDown = (e: React.KeyboardEvent) => {
    const i = categories.findIndex((c) => c.id === activeId);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveId(categories[(i + 1) % categories.length].id);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveId(categories[(i - 1 + categories.length) % categories.length].id);
    }
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
          activeSolutionId ? "text-[#f6e7b4] font-semibold" : "text-[#e6d78a] hover:text-[#f1e7b4]"
        }`}
      >
        <span>Solutions</span>
        <Chevron dir="down" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
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
              onKeyDown={onListKeyDown}
              className="flex overflow-hidden rounded-2xl border border-[rgba(212,175,55,.35)] bg-[#0b0b0b]/95 shadow-[0_24px_60px_-12px_rgba(0,0,0,.8),0_0_0_1px_rgba(212,175,55,.06)] backdrop-blur-xl"
            >
              {/* categories list */}
              <ul className="w-[260px] shrink-0 p-2">
                {categories.map((c) => {
                  const isHovered = c.id === active?.id;
                  const isCurrentRoute = activeSolutionId === c.id;
                  const isClicked = clickedId === c.id;

                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => handleCategoryClick(c.id)}
                        onMouseEnter={() => setActiveId(c.id)}
                        onFocus={() => setActiveId(c.id)}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[14.5px] transition-all cursor-pointer ${
                          isClicked ? "scale-[0.98] opacity-80" : ""
                        } ${
                          isHovered || isCurrentRoute
                            ? "bg-[rgba(212,175,55,0.14)] text-[#f1e7b4] font-medium"
                            : "text-[#cfc7a0]/80 hover:text-[#f1e7b4]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {isCurrentRoute && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4c06e] shadow-[0_0_6px_#d4c06e]" />
                          )}
                          <span>{c.label}</span>
                        </div>
                        <Chevron
                          dir="right"
                          className={`transition-all duration-200 ${
                            isHovered ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"
                          }`}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* solutions preview for the hovered category */}
              <div className="hidden w-[360px] border-l border-[rgba(212,175,55,.18)] p-5 md:block">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active?.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d9c56e]">
                        {active?.label}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(active.id)}
                        className="text-[11.5px] text-[#e6d78a]/70 hover:text-[#f1e7b4] transition-colors underline underline-offset-2 cursor-pointer"
                      >
                        View Page →
                      </button>
                    </div>

                    <ul className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
                      {active?.solutions.map((s) => (
                        <li key={s.title}>
                          <button
                            type="button"
                            onClick={() => handleCategoryClick(active.id)}
                            role="menuitem"
                            className="block w-full text-left rounded-lg px-3 py-2 transition-colors hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none cursor-pointer group"
                          >
                            <span className="block text-[14px] font-medium text-[#f1e7b4] group-hover:text-white transition-colors">
                              {s.title}
                            </span>
                            {s.description && (
                              <span className="mt-0.5 block text-[12px] leading-snug text-[#cfc7a0]/60 line-clamp-1">
                                {s.description}
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

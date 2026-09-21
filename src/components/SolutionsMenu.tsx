import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Solution = { title: string; description?: string; href?: string };
type Category = { id: string; label: string; solutions: Solution[] };

export const SOLUTIONS_MENU: Category[] = [
  {
    id: "investment-products",
    label: "Investment Products",
    solutions: [
      { title: "Mutual Funds & ETFs", description: "Curated active, passive, and smart-beta fund strategies", href: "#solutions" },
      { title: "Alternative Investments", description: "High-yield private equity, venture, and private debt access", href: "#solutions" },
      { title: "Structured Products", description: "Custom payoff profiles with built-in capital protection", href: "#solutions" },
    ],
  },
  {
    id: "portfolio-solutions",
    label: "Portfolio Solutions",
    solutions: [
      { title: "Discretionary PMS", description: "Fully-managed active equity and algorithmic portfolios", href: "#solutions" },
      { title: "Multi-Asset Allocations", description: "Global diversified portfolios matched to dynamic risk appetites", href: "#solutions" },
      { title: "Tactical Overlays", description: "Short-term momentum capture to optimize cyclical returns", href: "#solutions" },
    ],
  },
  {
    id: "wealth-planning",
    label: "Wealth Planning",
    solutions: [
      { title: "Estate & Trust Advisory", description: "Secure succession frameworks for legacy transmission", href: "#solutions" },
      { title: "Tax Structuring", description: "Comprehensive tax planning to boost overall post-tax yields", href: "#solutions" },
      { title: "Family Office Services", description: "Institutional governance, accounting, and compliance reporting", href: "#solutions" },
    ],
  },
  {
    id: "real-estate",
    label: "Real Estate",
    solutions: [
      { title: "Commercial Real Estate", description: "Premium grade-A offices, warehousing, and retail assets", href: "#solutions" },
      { title: "Fractional Ownership", description: "High-yield premium real estate with modular entry ticket sizes", href: "#solutions" },
      { title: "REITs & InvITs portfolio", description: "Highly liquid, yield-bearing infrastructure and property trusts", href: "#solutions" },
    ],
  },
  {
    id: "lending-solutions",
    label: "Lending Solutions",
    solutions: [
      { title: "Loan Against Securities (LAS)", description: "Unlock instant cash flow without breaking compound cycles", href: "#solutions" },
      { title: "Structured Debt", description: "Bespoke personal and business credit line solutions", href: "#solutions" },
      { title: "Mortgage Advisory", description: "Sourcing optimized financing for commercial and residential acquisitions", href: "#solutions" },
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

export default function SolutionsMenu({ categories = SOLUTIONS_MENU }: { categories?: Category[] }) {
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
        className="inline-flex items-center gap-1.5 text-[#e6d78a] transition-colors hover:text-[#f1e7b4] focus-visible:outline-none focus-visible:text-[#f1e7b4] cursor-pointer"
      >
        Solutions
        <Chevron dir="down" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          // pt-3 (padding, not margin) bridges the gap so the hover never drops
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
              {/* categories */}
              <ul className="w-[250px] shrink-0 p-2">
                {categories.map((c) => {
                  const isActive = c.id === active?.id;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        role="menuitem"
                        onMouseEnter={() => setActiveId(c.id)}
                        onFocus={() => setActiveId(c.id)}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[15px] transition-colors focus-visible:outline-none cursor-pointer ${
                          isActive
                            ? "bg-[rgba(212,175,55,0.12)] text-[#f1e7b4]"
                            : "text-[#cfc7a0]/80 hover:text-[#f1e7b4]"
                        }`}
                      >
                        {c.label}
                        <Chevron
                          dir="right"
                          className={`transition-all duration-200 ${
                            isActive ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"
                          }`}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* solutions for the hovered category */}
              <div className="hidden w-[340px] border-l border-[rgba(212,175,55,.18)] p-5 md:block">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active?.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d9c56e]">
                      {active?.label}
                    </p>
                    <ul className="space-y-1">
                      {active?.solutions.map((s) => (
                        <li key={s.title}>
                          <a
                            href={s.href ?? "#"}
                            role="menuitem"
                            className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none"
                          >
                            <span className="block text-[14.5px] font-medium text-[#f1e7b4]">{s.title}</span>
                            {s.description && (
                              <span className="mt-0.5 block text-[12.5px] leading-snug text-[#cfc7a0]/60">
                                {s.description}
                              </span>
                            )}
                          </a>
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

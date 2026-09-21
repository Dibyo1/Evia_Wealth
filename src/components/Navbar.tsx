import React, { useState, useEffect } from "react";
import { ChevronDown, ArrowRight, Menu, X, Shield, Lock, ExternalLink, Sparkles } from "lucide-react";
import EviaLogo from "./EviaLogo";

interface NavbarProps {
  onReviewPortfolio: () => void;
  onLoginClick: () => void;
}

export default function Navbar({ onReviewPortfolio, onLoginClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isOverWhite, setIsOverWhite] = useState(false);

  useEffect(() => {
    let lastScrolled = false;
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== lastScrolled) {
        lastScrolled = isScrolled;
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Track when solutions section (the white cards) enters the top viewport area
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOverWhite(entry.isIntersecting);
      },
      {
        rootMargin: "-80px 0px -40% 0px",
        threshold: 0,
      }
    );
    const target = document.getElementById("solutions");
    if (target) observer.observe(target);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setProductsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "auto",
      });
    }
  };

  return (
    <header className="fixed top-4 md:top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        className={`pointer-events-auto w-full max-w-[1180px] h-[58px] md:h-[62px] px-4 md:px-6 rounded-full flex items-center justify-between transition-all duration-200 border ${
          isOverWhite
            ? "bg-[#18181b]/75 backdrop-blur-md border-neutral-300/30 shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
            : scrolled
            ? "bg-[#0a0a0c] border-white/12 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            : "bg-[#0a0a0c] border-white/8"
        }`}
      >
        {/* Left: Brand Logo Lockup */}
        <a
          href="#"
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "auto" });
          }}
        >
          <EviaLogo size="sm" />
        </a>

        {/* Center: Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1.5 text-[14px] font-medium text-[#e6d78a]">
          {/* Products Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              onMouseEnter={() => setProductsOpen(true)}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[#e6d78a] hover:text-[#ebe0a6] hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span>Products</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  productsOpen ? "rotate-180 text-[#cdb864]" : "text-[#cdb864]/70"
                }`}
              />
            </button>

            {productsOpen && (
              <div
                onMouseLeave={() => setProductsOpen(false)}
                className="absolute top-full left-0 mt-2 w-64 p-2 rounded-2xl bg-[#0e0e10] border border-[#cdb864]/20 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-[#d9c56e]">
                  Institutional Offerings
                </div>
                <button
                  onClick={() => scrollToSection("solutions")}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <div className="text-[13px] font-medium text-white group-hover:text-[#ebe0a6]">
                    Portfolio Management (PMS)
                  </div>
                  <div className="text-[11px] text-neutral-400">Targeted alpha generation</div>
                </button>
                <button
                  onClick={() => scrollToSection("solutions")}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <div className="text-[13px] font-medium text-white group-hover:text-[#ebe0a6]">
                    Integrated Advisory
                  </div>
                  <div className="text-[11px] text-neutral-400">Multi-asset UHNI family office</div>
                </button>
                <button
                  onClick={() => scrollToSection("solutions")}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <div className="text-[13px] font-medium text-white group-hover:text-[#ebe0a6]">
                    Fixed Income & Debt
                  </div>
                  <div className="text-[11px] text-neutral-400">Yield management across cycles</div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => scrollToSection("team")}
            className="px-3.5 py-1.5 rounded-full text-[#e6d78a] hover:text-[#ebe0a6] hover:bg-white/5 transition-colors cursor-pointer"
          >
            Our Team
          </button>

          <button
            onClick={() => scrollToSection("partners")}
            className="px-3.5 py-1.5 rounded-full text-[#e6d78a] hover:text-[#ebe0a6] hover:bg-white/5 transition-colors cursor-pointer"
          >
            Client Partners
          </button>

          <button
            onClick={() => scrollToSection("offices")}
            className="px-3.5 py-1.5 rounded-full text-[#e6d78a] hover:text-[#ebe0a6] hover:bg-white/5 transition-colors cursor-pointer"
          >
            Offices
          </button>

          <a
            href="#esop"
            onClick={(e) => {
              e.preventDefault();
              onReviewPortfolio();
            }}
            className="px-3.5 py-1.5 rounded-full text-[#e6d78a] hover:text-[#ebe0a6] hover:bg-white/5 transition-colors cursor-pointer"
          >
            ESOP portal
          </a>
        </div>

        {/* Right: Desktop Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onLoginClick}
            className="text-[14px] font-medium text-[#e6d78a] hover:text-[#ebe0a6] px-3 py-1.5 transition-colors cursor-pointer"
          >
            Member login
          </button>

          <button
            onClick={onReviewPortfolio}
            className="flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-gradient-to-r from-[#ebe0a6] via-[#d4c06e] to-[#a89537] text-black font-semibold text-[13px] md:text-[14px] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_28px_rgba(212,175,55,0.5)] active:scale-[0.98] transition-all group cursor-pointer"
          >
            <span>Review my portfolio</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onReviewPortfolio}
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#ebe0a6] via-[#d4c06e] to-[#a89537] text-black text-xs font-semibold shadow-[0_0_12px_rgba(212,175,55,0.3)]"
          >
            Review
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#e6d78a] hover:text-white rounded-full bg-neutral-900 border border-white/10"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden pointer-events-auto fixed inset-x-4 top-20 bg-[#0e0e10] border border-white/12 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in duration-200">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => scrollToSection("solutions")}
              className="text-left text-base font-semibold text-white py-2 px-3 rounded-xl hover:bg-white/5"
            >
              Products & Solutions
            </button>
            <button
              onClick={() => scrollToSection("team")}
              className="text-left text-base font-semibold text-white py-2 px-3 rounded-xl hover:bg-white/5"
            >
              Our Leadership Team
            </button>
            <button
              onClick={() => scrollToSection("partners")}
              className="text-left text-base font-semibold text-white py-2 px-3 rounded-xl hover:bg-white/5"
            >
              Dedicated Client Partners
            </button>
            <button
              onClick={() => scrollToSection("offices")}
              className="text-left text-base font-semibold text-white py-2 px-3 rounded-xl hover:bg-white/5"
            >
              Advisory Suites & Offices
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onReviewPortfolio();
              }}
              className="text-left text-base font-semibold text-white py-2 px-3 rounded-xl hover:bg-white/5"
            >
              ESOP Portal
            </button>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLoginClick();
              }}
              className="w-full py-2.5 rounded-full border border-[#cdb864]/30 text-sm font-medium text-[#e6d78a] hover:bg-white/5"
            >
              Member login
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onReviewPortfolio();
              }}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#ebe0a6] via-[#d4c06e] to-[#a89537] text-black text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              <span>Review my portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

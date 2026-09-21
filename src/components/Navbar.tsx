import React, { useState, useEffect } from "react";
import { ChevronDown, ArrowRight, Menu, X } from "lucide-react";
import EviaLogo from "./EviaLogo";

interface NavbarProps {
  onReviewPortfolio: () => void;
  onLoginClick: () => void;
}

export default function Navbar({ onReviewPortfolio, onLoginClick }: NavbarProps) {
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setProductsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 68; // perfectly aligns with our 68px desktop bar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(element, { offset: -navOffset, duration: 1.2 });
      } else {
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <>
      <style>{`
        #main-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 68px;
          z-index: 1000;
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(10, 10, 10, 0.92);
          transform: translateZ(0);
          contain: paint;
          transition: background 250ms ease, border-color 250ms ease;
        }

        @supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
          #main-navbar {
            background: rgba(0, 0, 0, 0.55);
            backdrop-filter: blur(20px) saturate(1.2);
            -webkit-backdrop-filter: blur(20px) saturate(1.2);
          }
        }

        @media (max-width: 900px) {
          #main-navbar {
            height: 56px;
          }
          .mobile-only {
            display: flex !important;
          }
          .desktop-only {
            display: none !important;
          }
        }

        @media (min-width: 901px) {
          .mobile-only {
            display: none !important;
          }
          .desktop-only {
            display: flex !important;
          }
        }
      `}</style>

      <header id="main-navbar">
        {/* Desktop Navbar Row (Visible above 900px) */}
        <div className="desktop-only w-full h-[68px] px-12 flex items-center justify-between">
          
          {/* Left Block: Logo & Links with 28px gaps */}
          <div className="flex items-center">
            {/* Logo: EviaLogo (about 40px height at size="md") */}
            <a
              href="#"
              className="flex items-center group cursor-pointer focus:outline-none shrink-0"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "auto" });
              }}
            >
              <EviaLogo size="md" />
            </a>

            {/* Links group immediately after logo */}
            <div 
              className="flex items-center gap-[28px] ml-[28px] text-[15px] font-medium text-[#e6d78a]"
              style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "normal" }}
            >
              {/* Products Hover Dropdown */}
              <div
                className="relative py-5"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                <button
                  onClick={() => setProductsOpen(!productsOpen)}
                  className="flex items-center gap-1.5 text-[#e6d78a] hover:text-[#f6e7b4] transition-colors duration-150 cursor-pointer focus:outline-none"
                >
                  <span>Products</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-150 ${
                      productsOpen ? "rotate-180 text-[#cdb864]" : "text-[#cdb864]/70"
                    }`}
                  />
                </button>

                {productsOpen && (
                  <div
                    className="absolute top-[85%] left-0 mt-1 w-64 p-2 rounded-2xl bg-[#0d0d0f]/95 border border-[#cdb864]/25 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150 z-[1100]"
                  >
                    <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-[#d9c56e]">
                      Institutional Offerings
                    </div>
                    <button
                      onClick={() => scrollToSection("solutions")}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      <div className="text-[13px] font-medium text-white group-hover:text-[#ebe0a6]">
                        Portfolio Management (PMS)
                      </div>
                      <div className="text-[11px] text-neutral-400">Targeted alpha generation</div>
                    </button>
                    <button
                      onClick={() => scrollToSection("solutions")}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      <div className="text-[13px] font-medium text-white group-hover:text-[#ebe0a6]">
                        Integrated Advisory
                      </div>
                      <div className="text-[11px] text-neutral-400">Multi-asset UHNI family office</div>
                    </button>
                    <button
                      onClick={() => scrollToSection("solutions")}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
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
                className="text-[#e6d78a] hover:text-[#f6e7b4] transition-colors duration-150 cursor-pointer focus:outline-none"
              >
                Our Team
              </button>

              <button
                onClick={() => scrollToSection("partners")}
                className="text-[#e6d78a] hover:text-[#f6e7b4] transition-colors duration-150 cursor-pointer focus:outline-none"
              >
                Client Partners
              </button>

              <button
                onClick={() => scrollToSection("offices")}
                className="text-[#e6d78a] hover:text-[#f6e7b4] transition-colors duration-150 cursor-pointer focus:outline-none"
              >
                Offices
              </button>

              <a
                href="#esop"
                onClick={(e) => {
                  e.preventDefault();
                  onReviewPortfolio();
                }}
                className="text-[#e6d78a] hover:text-[#f6e7b4] transition-colors duration-150 cursor-pointer"
              >
                ESOP portal
              </a>
            </div>
          </div>

          {/* Right Block: Member Login & CTA Button */}
          <div className="flex items-center gap-6">
            <button
              onClick={onLoginClick}
              className="text-[15px] font-medium text-[#e6d78a] hover:text-[#f6e7b4] transition-colors duration-150 cursor-pointer focus:outline-none"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Member login
            </button>

            <button
              onClick={onReviewPortfolio}
              className="flex items-center gap-2 h-[40px] px-5 rounded-full bg-gradient-to-r from-[#ebe0a6] via-[#d4c06e] to-[#a89537] text-black font-semibold text-[14px] shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:shadow-[0_0_22px_rgba(212,175,55,0.45)] active:scale-[0.98] transition-all duration-150 group cursor-pointer focus:outline-none"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span>Review my portfolio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Mobile Navbar Row (Visible under 900px) */}
        <div className="mobile-only w-full h-[56px] px-6 flex items-center justify-between">
          <a
            href="#"
            className="flex items-center group cursor-pointer focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "auto" });
            }}
          >
            <EviaLogo size="sm" />
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#e6d78a] hover:text-white rounded-full bg-white/5 border border-white/10 focus:outline-none transition-all"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-down Full-Width Blurred Menu Panel */}
      {mobileMenuOpen && (
        <div
          className="mobile-only fixed left-0 right-0 top-[56px] w-full border-b border-white/8 p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-top duration-200"
          style={{
            background: "rgba(0, 0, 0, 0.88)",
            backdropFilter: "blur(20px) saturate(1.2)",
            WebkitBackdropFilter: "blur(20px) saturate(1.2)",
            zIndex: 999
          }}
        >
          <div className="flex flex-col gap-2">
            <button
              onClick={() => scrollToSection("solutions")}
              className="text-left text-[16px] font-semibold text-white py-2 px-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              Products & Solutions
            </button>
            <button
              onClick={() => scrollToSection("team")}
              className="text-left text-[16px] font-semibold text-white py-2 px-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              Our Leadership Team
            </button>
            <button
              onClick={() => scrollToSection("partners")}
              className="text-left text-[16px] font-semibold text-white py-2 px-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              Dedicated Client Partners
            </button>
            <button
              onClick={() => scrollToSection("offices")}
              className="text-left text-[16px] font-semibold text-white py-2 px-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              Advisory Suites & Offices
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onReviewPortfolio();
              }}
              className="text-left text-[16px] font-semibold text-white py-2 px-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              ESOP Portal
            </button>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLoginClick();
              }}
              className="w-full py-3 rounded-full border border-[#cdb864]/30 text-sm font-medium text-[#e6d78a] hover:bg-white/5 transition-all text-center"
            >
              Member login
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onReviewPortfolio();
              }}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#ebe0a6] via-[#d4c06e] to-[#a89537] text-black text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all"
            >
              <span>Review my portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

import React, { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import EviaLogo from "./EviaLogo";
import SolutionsMenu from "./SolutionsMenu";
import { useNavigation } from "../context/NavigationContext";

interface NavbarProps {
  onReviewPortfolio: () => void;
  onLoginClick: (origin?: { x: number; y: number }) => void;
}

export default function Navbar({ onReviewPortfolio, onLoginClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isHome, isResearch, isPrivileges, isContact, navigate } = useNavigation();

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);

    if (!isHome) {
      navigate("/", id);
      return;
    }

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
    } else {
      navigate("/", id);
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
              href="/"
              className="flex items-center group cursor-pointer focus:outline-none shrink-0"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              <EviaLogo size="md" />
            </a>

            {/* Links group immediately after logo */}
            <div 
              className="flex items-center gap-[28px] ml-[28px] text-[15px] font-medium text-[#e6d78a]"
              style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "normal" }}
            >
              {/* Solutions Dropdown Menu */}
              <SolutionsMenu />

              <button
                onClick={() => navigate("/research-and-insights")}
                className={`transition-colors duration-150 cursor-pointer focus:outline-none ${
                  isResearch ? "text-[#f6e7b4] font-semibold" : "text-[#e6d78a] hover:text-[#f6e7b4]"
                }`}
              >
                Research & Insights
              </button>

              <button
                onClick={() => scrollToSection("about")}
                className="text-[#e6d78a] hover:text-[#f6e7b4] transition-colors duration-150 cursor-pointer focus:outline-none"
              >
                About Us
              </button>

              <button
                onClick={() => navigate("/special-privileges")}
                className={`transition-colors duration-150 cursor-pointer focus:outline-none ${
                  isPrivileges ? "text-[#f6e7b4] font-semibold" : "text-[#e6d78a] hover:text-[#f6e7b4]"
                }`}
              >
                Special Privileges
              </button>

              <button
                onClick={() => navigate("/contact")}
                className={`transition-colors duration-150 cursor-pointer focus:outline-none ${
                  isContact ? "text-[#f6e7b4] font-semibold" : "text-[#e6d78a] hover:text-[#f6e7b4]"
                }`}
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* Right Block: Member Login & CTA Button */}
          <div className="flex items-center gap-6">
            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                onLoginClick({
                  x: Math.round(rect.left + rect.width / 2),
                  y: Math.round(rect.top + rect.height / 2),
                });
              }}
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
            href="/"
            className="flex items-center group cursor-pointer focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
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
          className="mobile-only fixed left-0 right-0 top-[56px] w-full border-b border-white/8 p-6 flex flex-col gap-5 animate-in fade-in slide-in-from-top duration-200 max-h-[calc(100vh-56px)] overflow-y-auto"
          style={{
            background: "rgba(0, 0, 0, 0.94)",
            backdropFilter: "blur(20px) saturate(1.2)",
            WebkitBackdropFilter: "blur(20px) saturate(1.2)",
            zIndex: 999
          }}
        >
          <div className="flex flex-col gap-1.5">
            <div className="px-3 pt-1 pb-1">
              <span className="text-[11px] font-semibold tracking-wider text-[#d9c56e] uppercase">
                Solutions
              </span>
            </div>
            <div className="grid grid-cols-1 gap-1 pl-2 mb-2 border-l border-[#d4af37]/25 ml-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/solutions/investment-products");
                }}
                className="text-left text-[14.5px] text-[#f1e7b4] py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                Investment Products
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/solutions/portfolio-solutions");
                }}
                className="text-left text-[14.5px] text-[#f1e7b4] py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                Portfolio Solutions
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/solutions/wealth-planning");
                }}
                className="text-left text-[14.5px] text-[#f1e7b4] py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                Wealth Planning
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/solutions/real-estate");
                }}
                className="text-left text-[14.5px] text-[#f1e7b4] py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                Real Estate
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/solutions/lending-solutions");
                }}
                className="text-left text-[14.5px] text-[#f1e7b4] py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                Lending Solutions
              </button>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/research-and-insights");
              }}
              className={`text-left text-[15px] font-medium py-2 px-3 rounded-xl transition-colors ${
                isResearch ? "bg-white/10 text-[#f1e7b4] font-semibold" : "text-white hover:bg-white/5"
              }`}
            >
              Research and Insights
            </button>

            <button
              onClick={() => scrollToSection("about")}
              className="text-left text-[15px] font-medium text-white py-2 px-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              About Us
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/special-privileges");
              }}
              className={`text-left text-[15px] font-medium py-2 px-3 rounded-xl transition-colors ${
                isPrivileges ? "bg-white/10 text-[#f1e7b4] font-semibold" : "text-white hover:bg-white/5"
              }`}
            >
              Special Privileges
            </button>
            <button
              onClick={() => scrollToSection("offices")}
              className="text-left text-[15px] font-medium text-white py-2 px-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              Advisory Suites & Offices
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/contact");
              }}
              className={`text-left text-[15px] font-medium py-2 px-3 rounded-xl transition-colors ${
                isContact ? "bg-white/10 text-[#f1e7b4] font-semibold" : "text-white hover:bg-white/5"
              }`}
            >
              Contact Us
            </button>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setMobileMenuOpen(false);
                onLoginClick({
                  x: Math.round(rect.left + rect.width / 2),
                  y: Math.round(rect.top + rect.height / 2),
                });
              }}
              className="w-full py-3 rounded-full border border-[#cdb864]/30 text-sm font-medium text-[#e6d78a] hover:bg-white/5 transition-all text-center cursor-pointer"
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

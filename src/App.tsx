import React, { useState, useMemo } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import TestimonialsSection from "./components/TestimonialsSection";
import AboutUsSection from "./components/AboutUsSection";
import PhilosophySection from "./components/PhilosophySection";
import TimelineSection from "./components/TimelineSection";
import StackSection from "./components/StackSection";
import TeamSection from "./components/TeamSection";
import InsightsSection from "./components/InsightsSection";
import OfficesSection from "./components/OfficesSection";
import FooterSection from "./components/FooterSection";
import AppDownloadToast from "./components/AppDownloadToast";
import { PortfolioModal } from "./components/Modals";
import MemberLoginModal from "./components/MemberLoginModal";
import WelcomeSplash from "./components/WelcomeSplash";
import SolutionPageView from "./components/solutions/SolutionPageView";
import ResearchInsightsView from "./components/research/ResearchInsightsView";
import SpecialPrivilegesView from "./components/privileges/SpecialPrivilegesView";
import ContactUsView from "./components/contact/ContactUsView";
import AmcsEmpanelled from "./pages/AmcsEmpanelled";
import PageTransition from "./components/PageTransition";
import DemoOne from "./demo";
import { NavigationProvider, useNavigation } from "./context/NavigationContext";

import { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

import SmoothScroll from "./components/SmoothScroll";
import { useAutoAdvance, Zone } from "./hooks/useAutoAdvance";

const initParticles = async (engine: Engine) => {
  await loadSlim(engine);
};

function AppContent() {
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginOrigin, setLoginOrigin] = useState<{ x: number; y: number } | null>(null);
  const {
    isHome,
    isResearch,
    isPrivileges,
    isContact,
    isAmcsEmpanelled,
    isCommissionDisclosure,
    isReadingReveal,
    activeSolutionId,
    currentPath,
    isDisclosureModalOpen,
    closeDisclosureModal,
    navigate,
  } = useNavigation();

  const handleOpenLogin = (origin?: { x: number; y: number }) => {
    setLoginOrigin(origin ?? null);
    setLoginModalOpen(true);
  };

  // Configure the Auto-Advance Transition Zone only when on home page
  const zones = useMemo<Zone[]>(() => {
    if (!isHome) return [];
    return [
      {
        id: "philosophy-to-timeline",
        getBounds: () => {
          const philosophy = document.getElementById("philosophy");
          const heading = document.getElementById("timeline-heading");
          if (!philosophy || !heading) return null;

          const philosophyTop = philosophy.getBoundingClientRect().top + window.scrollY;
          const scrollMax = philosophy.offsetHeight - window.innerHeight;
          
          // Start auto-advance at scroll progress 0.82 (where the black dome covers the quote)
          const startY = philosophyTop + 0.82 * scrollMax;

          const headingTop = heading.getBoundingClientRect().top + window.scrollY;
          const headingHeight = heading.offsetHeight;
          
          // End auto-advance when the timeline heading is 60% visible
          const endY = headingTop - window.innerHeight + 0.60 * headingHeight;
          
          // targetY puts the heading block at 12vh from the top
          const targetY = headingTop - 0.12 * window.innerHeight;

          // upTargetY: the last fully readable state of the quote (scrollProgress = 0.45)
          const upTargetY = philosophyTop + 0.45 * scrollMax;

          return { startY, endY, targetY, upTargetY };
        }
      }
    ];
  }, [isHome]);

  useAutoAdvance(zones);

  return (
    <ParticlesProvider init={initParticles}>
      <SmoothScroll />
      <div className="min-h-screen bg-black text-white selection:bg-[#34d399]/30 selection:text-emerald-300 font-sans relative">
        <WelcomeSplash />

        {/* Floating Pill Navbar */}
        <Navbar
          onReviewPortfolio={() => setPortfolioModalOpen(true)}
          onLoginClick={handleOpenLogin}
        />

        {/* Main Content Sections: Home vs Research & Insights vs Solutions Sub-page with Smooth PageTransition */}
        <PageTransition routeKey={currentPath}>
          {isHome ? (
            <main id="home-view">
              {/* 4.1 Hero Section */}
              <HeroSection onReviewPortfolio={() => setPortfolioModalOpen(true)} />

              {/* About Us Section */}
              <AboutUsSection />

              {/* 4.6 Team of Experts Accordion */}
              <TeamSection />

              {/* 4.3 Leadership Philosophy Quote with Word Scroll Reveal & Integrated Curved Dome Transition */}
              <PhilosophySection />

              {/* 4.4 How Evia Wealth Does Things Differently Timeline */}
              <TimelineSection />

              {/* 4.5 Evia Wealth Stack */}
              <StackSection
                onAnalyseClick={() => setPortfolioModalOpen(true)}
                onTalkClick={() => setPortfolioModalOpen(true)}
              />

              {/* 4.8 Insights for our Clients */}
              <InsightsSection />

              {/* 4.9 Offices (3D Dotted Wireframe Globe + Expanded MapLibre Map) */}
              <OfficesSection onGetInTouch={() => setPortfolioModalOpen(true)} />

              {/* Testimonials */}
              <TestimonialsSection />
            </main>
          ) : isResearch ? (
            <main id="research-view">
              <ResearchInsightsView
                onReviewPortfolio={() => setPortfolioModalOpen(true)}
                onLoginClick={handleOpenLogin}
              />
            </main>
          ) : isPrivileges ? (
            <main id="privileges-view">
              <SpecialPrivilegesView
                onReviewPortfolio={() => setPortfolioModalOpen(true)}
                onLoginClick={handleOpenLogin}
              />
            </main>
          ) : isContact ? (
            <main id="contact-view">
              <ContactUsView
                onReviewPortfolio={() => setPortfolioModalOpen(true)}
                onLoginClick={handleOpenLogin}
              />
            </main>
          ) : isAmcsEmpanelled ? (
            <main id="amcs-view">
              <AmcsEmpanelled
                onReviewPortfolio={() => setPortfolioModalOpen(true)}
                onLoginClick={handleOpenLogin}
              />
            </main>
          ) : isCommissionDisclosure ? (
            <main id="disclosure-view" className="pt-28 pb-16 px-4 max-w-5xl mx-auto min-h-screen">
              <div className="rounded-2xl border border-[rgba(212,175,55,0.3)] bg-neutral-900/60 p-4 md:p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-xl font-serif text-[#f1e7b4]">Commission Disclosure</h1>
                    <p className="text-xs text-neutral-400">ARN-300286 • Evia Wealth</p>
                  </div>
                  <a
                    href="/documents/commission-disclosure.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.3)] text-[#f1e7b4] text-xs font-medium hover:bg-[rgba(212,175,55,0.25)] transition-colors"
                  >
                    Open PDF in New Tab
                  </a>
                </div>
                <iframe
                  src="/documents/commission-disclosure.pdf"
                  title="Commission Disclosure (ARN-300286)"
                  className="w-full h-[750px] rounded-xl border border-neutral-800 bg-neutral-950"
                />
              </div>
            </main>
          ) : isReadingReveal ? (
            <main id="reveal-view" className="min-h-screen relative pt-16">
              <div className="fixed top-24 left-6 z-40">
                <button
                  onClick={() => navigate("/")}
                  className="px-4 py-2 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-[#f1e7b4] border border-[rgba(212,175,55,0.3)] shadow-xl text-xs font-medium transition-all backdrop-blur-md cursor-pointer flex items-center gap-1.5"
                >
                  ← Back to Home
                </button>
              </div>
              <DemoOne />
            </main>
          ) : (
            <main id="solution-view">
              <SolutionPageView
                solutionId={activeSolutionId || "investment-products"}
                onReviewPortfolio={() => setPortfolioModalOpen(true)}
                onLoginClick={handleOpenLogin}
              />
            </main>
          )}
        </PageTransition>

        {/* 4.10 - 4.13 CTA, Newsletter, Badges & Footer */}
        <FooterSection onReviewPortfolio={() => setPortfolioModalOpen(true)} />

        {/* Floating App Download Toast */}
        <AppDownloadToast />

        {/* Interactive Modals */}
        <PortfolioModal
          isOpen={portfolioModalOpen}
          onClose={() => setPortfolioModalOpen(false)}
        />
        <MemberLoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          origin={loginOrigin}
        />
      </div>
    </ParticlesProvider>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}

import React, { useState, useMemo } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import TestimonialsSection from "./components/TestimonialsSection";
import AboutUsSection from "./components/AboutUsSection";
import PhilosophySection from "./components/PhilosophySection";
import TimelineSection from "./components/TimelineSection";
import StackSection from "./components/StackSection";
import TeamSection from "./components/TeamSection";
import PartnersSection from "./components/PartnersSection";
import InsightsSection from "./components/InsightsSection";
import OfficesSection from "./components/OfficesSection";
import TestimonialsWithMarquee from "./components/TestimonialsWithMarquee";
import FooterSection from "./components/FooterSection";
import AppDownloadToast from "./components/AppDownloadToast";
import { PortfolioModal } from "./components/Modals";
import MemberLoginModal from "./components/MemberLoginModal";
import WelcomeSplash from "./components/WelcomeSplash";
import SolutionPageView from "./components/solutions/SolutionPageView";
import ResearchInsightsView from "./components/research/ResearchInsightsView";
import SpecialPrivilegesView from "./components/privileges/SpecialPrivilegesView";
import ContactUsView from "./components/contact/ContactUsView";
import PageTransition from "./components/PageTransition";
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
  const { isHome, isResearch, isPrivileges, isContact, activeSolutionId, currentPath } = useNavigation();

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

              {/* 4.7 Dedicated Client Partners Carousel */}
              <PartnersSection />

              {/* 4.8 Insights for our Clients */}
              <InsightsSection />

              {/* 4.9 Offices (3D Dotted Wireframe Globe + Expanded MapLibre Map) */}
              <OfficesSection onGetInTouch={() => setPortfolioModalOpen(true)} />

              {/* New Testimonials & Institutional Logos Section */}
              <TestimonialsWithMarquee />
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

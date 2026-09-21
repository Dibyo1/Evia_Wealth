import React, { useState, useEffect, useMemo } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import TestimonialsSection from "./components/TestimonialsSection";
import PhilosophySection from "./components/PhilosophySection";
import TimelineSection from "./components/TimelineSection";
import StackSection from "./components/StackSection";
import TeamSection from "./components/TeamSection";
import PartnersSection from "./components/PartnersSection";
import InsightsSection from "./components/InsightsSection";
import OfficesSection from "./components/OfficesSection";
import FooterSection from "./components/FooterSection";
import AppDownloadToast from "./components/AppDownloadToast";
import { PortfolioModal, LoginModal } from "./components/Modals";
import WelcomeSplash from "./components/WelcomeSplash";

import { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

import Lenis from "lenis";

const initParticles = async (engine: Engine) => {
  await loadSlim(engine);
};
import { useAutoAdvance, Zone } from "./hooks/useAutoAdvance";

export default function App() {
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // 1. Initialize Lenis globally in a StrictMode-safe lifecycle
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // premium smooth easing
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    (window as any).lenis = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    document.documentElement.classList.add("lenis", "lenis-smooth");

    return () => {
      lenis.destroy();
      (window as any).lenis = undefined;
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, []);

  // 2. Configure the Auto-Advance Transition Zone
  const zones = useMemo<Zone[]>(() => [
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
  ], []);

  useAutoAdvance(zones);

  return (
    <ParticlesProvider init={initParticles}>
      <div className="min-h-screen bg-black text-white selection:bg-[#34d399]/30 selection:text-emerald-300 font-sans relative">
        <WelcomeSplash />

        {/* Floating Pill Navbar */}
        <Navbar
          onReviewPortfolio={() => setPortfolioModalOpen(true)}
          onLoginClick={() => setLoginModalOpen(true)}
        />

        {/* Main Content Sections */}
        <main>
          {/* 4.1 Hero Section */}
          <HeroSection onReviewPortfolio={() => setPortfolioModalOpen(true)} />

          {/* 4.2 Client Testimonials Carousel */}
          <TestimonialsSection />

          {/* 4.3 Leadership Philosophy Quote with Word Scroll Reveal & Integrated Curved Dome Transition */}
          <PhilosophySection />

          {/* 4.4 How Evia Wealth Does Things Differently Timeline */}
          <TimelineSection />

          {/* 4.5 Evia Wealth Stack */}
          <StackSection
            onAnalyseClick={() => setPortfolioModalOpen(true)}
            onTalkClick={() => setPortfolioModalOpen(true)}
          />

          {/* 4.6 Team of Experts Accordion */}
          <TeamSection />

          {/* 4.7 Dedicated Client Partners Carousel */}
          <PartnersSection />

          {/* 4.8 Insights for our Clients */}
          <InsightsSection />

          {/* 4.9 Offices (3D Dotted Wireframe Globe + Expanded MapLibre Map) */}
          <OfficesSection onGetInTouch={() => setPortfolioModalOpen(true)} />
        </main>

        {/* 4.10 - 4.13 CTA, Newsletter, Badges & Footer */}
        <FooterSection onReviewPortfolio={() => setPortfolioModalOpen(true)} />

        {/* Floating App Download Toast */}
        <AppDownloadToast />

        {/* Interactive Modals */}
        <PortfolioModal
          isOpen={portfolioModalOpen}
          onClose={() => setPortfolioModalOpen(false)}
        />
        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
        />
      </div>
    </ParticlesProvider>
  );
}

import React, { useState } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import TestimonialsSection from "./components/TestimonialsSection";
import PhilosophySection from "./components/PhilosophySection";
import TimelineSection from "./components/TimelineSection";
import CircularArcTransition from "./components/transitions/CircularArcTransition";
import StackSection from "./components/StackSection";
import TeamSection from "./components/TeamSection";
import PartnersSection from "./components/PartnersSection";
import InsightsSection from "./components/InsightsSection";
import OfficesSection from "./components/OfficesSection";
import FooterSection from "./components/FooterSection";
import AppDownloadToast from "./components/AppDownloadToast";
import { PortfolioModal, LoginModal } from "./components/Modals";

export default function App() {
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#34d399]/30 selection:text-emerald-300 font-sans relative">
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

        {/* 4.3 Leadership Philosophy Quote with Word Scroll Reveal */}
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
  );
}

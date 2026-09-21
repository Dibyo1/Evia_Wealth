import React, { useState } from "react";
import { ArrowRight, Lock, Award, ShieldCheck, Check } from "lucide-react";
import EviaLogo from "./EviaLogo";

interface FooterSectionProps {
  onReviewPortfolio: () => void;
}

export default function FooterSection({ onReviewPortfolio }: FooterSectionProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
      }, 2000);
    }
  };

  return (
    <footer className="bg-black text-white relative pt-16 pb-12 overflow-hidden border-t border-white/6">
      <div className="max-w-[1120px] mx-auto px-5 sm:px-6">
        {/* 4.10 Final CTA Banner */}
        <div className="relative rounded-[28px] bg-gradient-to-b from-[#17150d] via-[#100f0a] to-[#080806] border border-[#cdb864]/30 p-8 sm:p-12 md:p-16 text-center mb-14 overflow-hidden shadow-[0_20px_70px_rgba(212,175,55,0.10)]">
          {/* Subtle glowing center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[rgba(212,175,55,0.12)] rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-[760px] mx-auto flex flex-col items-center">
            <div className="gold-eyebrow-pill mb-5">
              <span className="gold-dot" />
              <span className="gold-eyebrow-text">
                START YOUR JOURNEY
              </span>
            </div>

            <h2 className="text-[34px] sm:text-[46px] md:text-[54px] font-bold tracking-[-0.03em] leading-[1.12] mb-6 gold-gradient-heading">
              You are building India's future,
              <br />
              we would like to build yours.
            </h2>

            <p className="text-[15px] sm:text-[16px] text-neutral-300 leading-relaxed max-w-[620px] mb-8 font-normal">
              Experience the peace of mind that comes with institutional portfolio surveillance, unbiased multi-asset allocation, and dedicated advisory partners.
            </p>

            <button
              onClick={onReviewPortfolio}
              className="h-12 px-8 rounded-full gold-pill-btn text-xs tracking-widest uppercase flex items-center gap-2 group cursor-pointer"
            >
              <span>REVIEW MY PORTFOLIO</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-black" />
            </button>
          </div>
        </div>

        {/* 4.11 Newsletter Strip */}
        <div className="rounded-2xl bg-[#0f0f12] border border-white/8 p-6 sm:p-8 mb-14 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="md:max-w-[480px]">
            <h3 className="text-[18px] font-semibold text-white mb-1">
              Our weekly expert newsletter
            </h3>
            <p className="text-[13px] text-neutral-400 leading-relaxed">
              Curated stories, macroeconomic intelligence, and wealth frameworks that matter to your money.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex-1 max-w-[420px] flex items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="flex-1 h-11 px-4 rounded-full bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            <button
              type="submit"
              className="h-11 px-6 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              {subscribed ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Subscribed</span>
                </>
              ) : (
                <span>Subscribe</span>
              )}
            </button>
          </form>
        </div>

        {/* 4.12 Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-16">
          {/* Badge 1 */}
          <div className="rounded-2xl bg-[#0e0e11] border border-white/8 p-5 sm:p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#34d399] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[12px] font-bold tracking-wider uppercase text-white mb-1">
                BANK-GRADE SECURITY
              </div>
              <p className="text-[12px] text-neutral-400 leading-relaxed">
                Data encrypted with 256-bit AES encryption
              </p>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="rounded-2xl bg-[#0e0e11] border border-white/8 p-5 sm:p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#34d399] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[12px] font-bold tracking-wider uppercase text-white mb-1">
                ISO 27001 CERTIFIED
              </div>
              <p className="text-[12px] text-neutral-400 leading-relaxed">
                Compliant with global data privacy standards
              </p>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="rounded-2xl bg-[#0e0e11] border border-white/8 p-5 sm:p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#34d399] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[12px] font-bold tracking-wider uppercase text-white mb-1">
                REGULATED ENTITY
              </div>
              <p className="text-[12px] text-neutral-400 leading-relaxed">
                With licenses from SEBI, APMI and AMFI
              </p>
            </div>
          </div>
        </div>

        {/* 4.13 Footer Link Columns */}
        <div className="pt-12 border-t border-white/8 grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand Col (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-start">
            {/* Gold Logo */}
            <div className="mb-4">
              <EviaLogo size="md" />
            </div>

            <p className="text-[13px] text-neutral-400 leading-relaxed max-w-[360px] mb-4">
              Evia Wealth is an institutional wealth management and multi-asset advisory platform. We craft bespoke portfolios engineered for capital preservation and uninterrupted compounding.
            </p>

            <div className="text-[12px] text-neutral-500 font-medium">
              Offices in Mumbai • Bengaluru • Delhi NCR • Kolkata
            </div>
          </div>

          {/* Links Col 1: Products */}
          <div className="md:col-span-2 sm:col-span-4">
            <div className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 mb-4">
              PRODUCTS
            </div>
            <ul className="space-y-2.5 text-[13px] text-neutral-400">
              <li><a href="#solutions" className="hover:text-white transition-colors">Portfolio Management (PMS)</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">Integrated Wealth Advisory</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">Curated Mutual Funds</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">Fixed Income & Bonds</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">Alternative Assets (AIF)</a></li>
            </ul>
          </div>

          {/* Links Col 2: Company */}
          <div className="md:col-span-2 sm:col-span-4">
            <div className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 mb-4">
              COMPANY
            </div>
            <ul className="space-y-2.5 text-[13px] text-neutral-400">
              <li><a href="#" className="hover:text-white transition-colors">Investment Philosophy</a></li>
              <li><a href="#partners" className="hover:text-white transition-colors">Dedicated Client Partners</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onReviewPortfolio(); }} className="hover:text-white transition-colors">Compounding Calculator</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Client Reviews</a></li>
              <li><a href="#offices" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Links Col 3: Legal */}
          <div className="md:col-span-3 sm:col-span-4">
            <div className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 mb-4">
              LEGAL
            </div>
            <ul className="space-y-2.5 text-[13px] text-neutral-400">
              <li><a href="#" className="hover:text-white transition-colors">SEBI Registration</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms & Disclosures</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Investor Charter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">ODR Portal</a></li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Bottom */}
        <div className="pt-8 border-t border-white/6 space-y-3 text-[11px] text-neutral-500 leading-relaxed font-sans">
          <p>
            Evia Wealth is a registered trademark of Evia Wealth Management Private Limited, AMFI Registered Mutual Fund Distributor (ARN-248108). Regulated by the Securities and Exchange Board of India (SEBI).
          </p>
          <p>
            Disclaimer: Investments in securities markets are subject to market risks; read all related documents carefully before investing. Past performance is not indicative of future returns.
          </p>
          <p className="pt-2 text-neutral-400">
            © 2026 Evia Wealth. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

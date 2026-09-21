import React, { useState } from "react";
import { X, CheckCircle, ArrowRight, Shield, Lock, Building2 } from "lucide-react";

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PortfolioModal({ isOpen, onClose }: PortfolioModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    portfolioSize: "₹1Cr – ₹5Cr",
    goal: "Evaluate risk & optimize alpha",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Auto close after brief message
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#111114] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Close"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-[#34d399] border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Portfolio Review Scheduled</h3>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
              Thank you, {formData.name || "Investor"}. A dedicated Client Partner will connect within 2 business hours with your institutional analysis.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-4 px-6 py-2 rounded-full bg-white text-black text-xs font-semibold"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#34d399]/10 border border-[#34d399]/30 text-[#34d399] text-[10px] font-bold uppercase tracking-wider mb-3">
              Institutional Advisory
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-1">
              Review My Portfolio
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Get an unbiased 1-on-1 audit on asset allocation, tax efficiency, and institutional downside protection.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikram Singhania"
                  className="w-full h-11 px-4 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full h-11 px-4 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full h-11 px-4 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Current Portfolio Size
                </label>
                <select
                  value={formData.portfolioSize}
                  onChange={(e) => setFormData({ ...formData, portfolioSize: e.target.value })}
                  className="w-full h-11 px-3 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/60"
                >
                  <option value="₹50L – ₹1Cr">₹50L – ₹1Cr</option>
                  <option value="₹1Cr – ₹5Cr">₹1Cr – ₹5Cr (PMS Standard)</option>
                  <option value="₹5Cr – ₹25Cr">₹5Cr – ₹25Cr (Multi-Asset)</option>
                  <option value="₹25Cr+">₹25Cr+ (Family Office / UHNI)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full h-12 mt-2 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Request Private Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 pt-2">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Confidential • 256-bit encrypted • Zero spam guarantee</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#111114] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Close"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#9c7820] via-[#dfba48] to-[#fde587] p-[1.5px] mb-4 flex items-center justify-center">
          <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-serif text-sm font-bold text-[#dfba48]">
            EW
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-1">
          Client Portal Login
        </h3>
        <p className="text-xs text-neutral-400 mb-6">
          Access your real-time portfolio surveillance and capital compounding telemetry.
        </p>

        {!codeSent ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setCodeSent(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Registered Email or Mobile
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@eviawealth.com"
                className="w-full h-11 px-4 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all cursor-pointer"
            >
              Continue with Secure OTP
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="text-xs text-neutral-300">
              A 6-digit verification code has been sent to <br />
              <span className="font-semibold text-white">{email}</span>
            </div>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  defaultValue={i === 1 ? "8" : i === 2 ? "4" : ""}
                  className="w-9 h-11 text-center bg-neutral-900 border border-white/15 rounded-lg text-white font-mono font-bold"
                />
              ))}
            </div>
            <button
              onClick={onClose}
              className="w-full h-11 rounded-full bg-[#34d399] text-black font-bold text-xs uppercase tracking-wider hover:bg-emerald-300 transition-all cursor-pointer"
            >
              Verify & Enter Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

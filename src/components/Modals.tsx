import React, { useState, useRef, useEffect, useMemo } from "react";
import { X, CheckCircle, ArrowRight, Shield, Lock, Building2, ChevronDown } from "lucide-react";
import EviaLogo from "./EviaLogo";
import EmailTypoSuggestion from "./EmailTypoSuggestion";
import { COUNTRY_CODES } from "../data/countryCodes";

// Comprehensive country list with country names and their respective dial codes (no emoji flags to prevent Windows two-letter fallback issues)
const ALL_COUNTRIES_WITH_CODES = Array.from(
  new Map(
    COUNTRY_CODES.map((c) => [c.name, { name: c.name, dial_code: c.dial_code }])
  ).values()
);

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PortfolioModal({ isOpen, onClose }: PortfolioModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState("+91");
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    portfolioSize: "₹1Cr – ₹5Cr",
    goal: "Evaluate risk & optimize alpha",
  });

  if (!isOpen) return null;

  const validatePhone = (phoneStr: string): boolean => {
    const digitsOnly = phoneStr.replace(/\D/g, "");
    if (!digitsOnly) {
      setPhoneError("Please enter your phone number.");
      return false;
    }
    if (digitsOnly.length < 7) {
      setPhoneError("Phone number must have at least 7 digits.");
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const validateEmail = (emailStr: string): boolean => {
    const trimmed = emailStr.trim();
    if (!trimmed) {
      setEmailError("Please enter your email address.");
      return false;
    }

    // Accepts real consumer domains (gmail.com, outlook.com, hotmail.com, yahoo.com, icloud.com, etc.)
    // as well as custom business/company domains (name@company.com, name@tata.com, etc.)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    if (!emailRegex.test(trimmed)) {
      setEmailError("Please enter a valid email (e.g. name@gmail.com, name@outlook.com, or your company domain).");
      return false;
    }

    const parts = trimmed.split("@");
    if (parts.length !== 2) {
      setEmailError("Please enter a valid email address.");
      return false;
    }

    const domain = parts[1].toLowerCase();
    const domainParts = domain.split(".");
    const tld = domainParts[domainParts.length - 1];

    if (!tld || tld.length < 2) {
      setEmailError("Please enter a complete domain (e.g. gmail.com, outlook.com, or your company domain).");
      return false;
    }

    setEmailError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailValid = validateEmail(formData.email);
    const isPhoneValid = validatePhone(formData.phone);
    if (!isEmailValid || !isPhoneValid) {
      return;
    }
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setEmailError(null);
    setPhoneError(null);
    setCountryCode("+91");
    setFormData({
      name: "",
      email: "",
      phone: "",
      portfolioSize: "₹1Cr – ₹5Cr",
      goal: "Evaluate risk & optimize alpha",
    });
    onClose();
  };

  return (
    <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#111114] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-left">
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Close"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-[#34d399] border border-emerald-500/35 flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(52,211,153,0.2)]">
              <CheckCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-[22px] sm:text-[24px] font-bold text-white tracking-tight">
                We will get back to you soon
              </h3>
              <p className="text-[11px] text-[#d9c56e] font-semibold uppercase tracking-wider">
                Private Consultation Request Received
              </p>
            </div>

            <p className="text-[13.5px] text-neutral-300 leading-relaxed max-w-sm mx-auto">
              Thank you, <span className="text-white font-semibold">{formData.name || "Investor"}</span>. Your portfolio details have been registered. Our senior wealth partners will review your profile and get back to you soon at <span className="text-[#e6d78a] font-medium">{formData.email}</span>.
            </p>

            {/* Quick summary receipt */}
            <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-white/10 text-left space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-neutral-400">
                <span>Selected Portfolio Tier:</span>
                <span className="text-white font-medium">{formData.portfolioSize}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>Contact Phone:</span>
                <span className="text-white font-medium">
                  {formData.phone.startsWith("+")
                    ? formData.phone
                    : `${countryCode} ${formData.phone}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>Confirmation Status:</span>
                <span className="text-[#34d399] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] inline-block animate-pulse" />
                  Advisor Queued
                </span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full h-11 mt-2 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-all cursor-pointer shadow-md"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <EviaLogo size="sm" />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34d399]/10 border border-[#34d399]/30 text-[#34d399] text-[10px] font-bold uppercase tracking-wider">
                Institutional Advisory
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-1">
              Review My Portfolio
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Get an unbiased 1-on-1 audit on asset allocation, tax efficiency, and institutional downside protection.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Field 1: Full Name */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikram Singhania"
                  className="w-full h-11 px-4 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-emerald-500/60 transition-colors"
                />
              </div>

              {/* Field 2: Email Address */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  EMAIL ADDRESS
                </label>
                <input
                  ref={emailInputRef}
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (emailError) validateEmail(e.target.value);
                  }}
                  onBlur={() => {
                    if (formData.email) validateEmail(formData.email);
                  }}
                  placeholder="name@gmail.com, outlook.com, or company.com"
                  className={`w-full h-11 px-4 rounded-xl bg-neutral-900 border text-white placeholder:text-neutral-500 text-sm focus:outline-none transition-colors ${
                    emailError
                      ? "border-red-500/80 focus:border-red-500"
                      : "border-white/10 focus:border-emerald-500/60"
                  }`}
                />
                <EmailTypoSuggestion
                  email={formData.email}
                  inputRef={emailInputRef}
                  onAccept={(corrected) => {
                    setFormData((prev) => ({ ...prev, email: corrected }));
                    if (emailError) setEmailError(null);
                  }}
                />
                {emailError ? (
                  <p className="text-[10.5px] text-red-400 mt-1.5 leading-tight">
                    {emailError}
                  </p>
                ) : (
                  <p className="text-[10px] text-neutral-500 mt-1.5 leading-tight">
                    Accepts Gmail, Outlook, Hotmail, or custom company domains
                  </p>
                )}
              </div>

              {/* Field 3: Phone Number with Country Code */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  PHONE NUMBER
                </label>
                <div
                  className={`flex items-center rounded-xl bg-neutral-900 border transition-colors overflow-hidden ${
                    phoneError
                      ? "border-red-500/80 focus-within:border-red-500"
                      : "border-white/10 focus-within:border-emerald-500/60"
                  }`}
                >
                  <div className="relative flex items-center border-r border-white/10 bg-neutral-800/40 shrink-0">
                    <div className="h-11 pl-3 pr-7 flex items-center text-white text-xs sm:text-sm font-medium pointer-events-none select-none">
                      <span>{countryCode}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2 pointer-events-none" />
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      aria-label="Country Code"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-sm bg-neutral-900 text-white"
                    >
                      {ALL_COUNTRIES_WITH_CODES.map((item, idx) => (
                        <option
                          key={`${item.name}-${item.dial_code}-${idx}`}
                          value={item.dial_code}
                          className="bg-neutral-900 text-white py-1"
                        >
                          {item.name} ({item.dial_code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={15}
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, phone: digitsOnly });
                      if (phoneError) validatePhone(digitsOnly);
                    }}
                    onBlur={() => {
                      if (formData.phone) validatePhone(formData.phone);
                    }}
                    placeholder="e.g. 98765 43210"
                    className="flex-1 h-11 px-3.5 bg-transparent text-white placeholder:text-neutral-500 text-sm focus:outline-none"
                  />
                </div>
                {phoneError && (
                  <p className="text-[10.5px] text-red-400 mt-1.5 leading-tight">
                    {phoneError}
                  </p>
                )}
              </div>

              {/* Field 4: Current Portfolio Size */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  CURRENT PORTFOLIO SIZE
                </label>
                <div className="relative flex items-center">
                  <select
                    value={formData.portfolioSize}
                    onChange={(e) => setFormData({ ...formData, portfolioSize: e.target.value })}
                    className="w-full h-11 pl-4 pr-10 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/60 appearance-none cursor-pointer transition-colors"
                  >
                    <option value="₹50L – ₹1Cr">₹50L – ₹1Cr</option>
                    <option value="₹1Cr – ₹5Cr">₹1Cr – ₹5Cr (PMS Standard)</option>
                    <option value="₹5Cr – ₹25Cr">₹5Cr – ₹25Cr (Multi-Asset)</option>
                    <option value="₹25Cr+">₹25Cr+ (Family Office / UHNI)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                className="w-full h-12 mt-2 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-[0.99]"
              >
                <span>Request Private Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 pt-1.5">
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
    <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#111114] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Close"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5 flex items-center">
          <EviaLogo size="md" />
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

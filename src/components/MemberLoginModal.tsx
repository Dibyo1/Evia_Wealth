import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Eye,
  EyeOff,
  Smartphone,
  Coins,
  IndianRupee,
  ShoppingCart,
  Mail,
  Clock,
  TrendingUp,
  Lightbulb,
  PiggyBank,
  ShieldCheck,
  CreditCard,
  Landmark,
  PieChart,
  Lock,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import EviaLogo from "./EviaLogo";
import { useNavigation } from "../context/NavigationContext";

interface MemberLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  origin?: { x: number; y: number } | null;
}

export default function MemberLoginModal({
  isOpen,
  onClose,
  origin,
}: MemberLoginModalProps) {
  const { navigate } = useNavigation();

  // Mode: "password" vs "otp" vs "forgot"
  const [mode, setMode] = useState<"password" | "otp" | "forgot">("password");

  // Password Login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // OTP Login state
  const [otpTarget, setOtpTarget] = useState("");
  const [otpTargetError, setOtpTargetError] = useState(false);
  const [otpCodeSent, setOtpCodeSent] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);

  // Detect prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(media.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, []);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setUsernameError(false);
      setPasswordError(false);
      setOtpTargetError(false);
      setIsSubmitting(false);
      setLoginSuccess(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle standard password form submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasErr = false;
    if (!username.trim()) {
      setUsernameError(true);
      hasErr = true;
    } else {
      setUsernameError(false);
    }

    if (!password.trim()) {
      setPasswordError(true);
      hasErr = true;
    } else {
      setPasswordError(false);
    }

    if (hasErr) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setLoginSuccess(true);
      setTimeout(() => {
        onClose();
        setLoginSuccess(false);
      }, 1500);
    }, 900);
  };

  // Handle OTP request
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpTarget.trim()) {
      setOtpTargetError(true);
      return;
    }
    setOtpTargetError(false);
    setOtpCodeSent(true);
  };

  // Handle OTP verification
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setLoginSuccess(true);
      setTimeout(() => {
        onClose();
        setLoginSuccess(false);
      }, 1500);
    }, 900);
  };

  // Compute dynamic clip origin: default to top right if not supplied
  const clickX = origin?.x ?? (typeof window !== "undefined" ? window.innerWidth - 220 : 600);
  const clickY = origin?.y ?? 34;

  const clipStart = `circle(0% at ${clickX}px ${clickY}px)`;
  const clipEnd = `circle(150% at ${clickX}px ${clickY}px)`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="member-login-portal-wrapper"
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { clipPath: clipStart, opacity: 1 }
          }
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : { clipPath: clipEnd, opacity: 1 }
          }
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { clipPath: clipStart, opacity: 1 }
          }
          transition={{
            duration: prefersReducedMotion ? 0.2 : 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="fixed inset-0 z-[2000] overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          data-lenis-prevent
        >
          {/* ============================================================== */}
          {/* 4) BACKGROUND (dimmed black base, subtle faint icons + glow)  */}
          {/* ============================================================== */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
            {/* Soft dark-green radial glow behind panel */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/[0.08] rounded-full blur-[140px]" />
            {/* Soft gold radial aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-[rgba(212,175,55,0.06)] rounded-full blur-[100px]" />

            {/* Faint gold/white decorative line icon texture motif (~5-8% opacity) */}
            <div className="absolute inset-0 text-[#d4af37] opacity-[0.06] grid grid-cols-4 md:grid-cols-6 gap-20 p-12 items-center justify-items-center">
              <Coins className="w-12 h-12" />
              <IndianRupee className="w-12 h-12" />
              <ShoppingCart className="w-12 h-12" />
              <Mail className="w-12 h-12" />
              <Clock className="w-12 h-12" />
              <TrendingUp className="w-12 h-12" />
              <Lightbulb className="w-12 h-12" />
              <PiggyBank className="w-12 h-12" />
              <ShieldCheck className="w-12 h-12" />
              <CreditCard className="w-12 h-12" />
              <Landmark className="w-12 h-12" />
              <PieChart className="w-12 h-12" />
              <Coins className="w-12 h-12" />
              <IndianRupee className="w-12 h-12" />
              <ShoppingCart className="w-12 h-12" />
              <Mail className="w-12 h-12" />
              <Clock className="w-12 h-12" />
              <TrendingUp className="w-12 h-12" />
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2) CENTERED MODAL PANEL (max-w ~460px, #0e0e0f card)          */}
          {/* ============================================================== */}
          <div
            className="relative w-full max-w-[460px] my-auto bg-[#0e0e0f] border border-white/[0.08] rounded-[24px] p-7 sm:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.85)] z-10 text-white"
            onClick={(e) => e.stopPropagation()}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {/* Top-Right Close "×" Icon Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 hover:text-[#d4af37] flex items-center justify-center transition-colors cursor-pointer focus:outline-none"
              title="Close"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Back button when in sub-mode */}
            {mode !== "password" && (
              <button
                onClick={() => setMode("password")}
                className="absolute top-6 left-6 w-9 h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 hover:text-[#d4af37] flex items-center justify-center transition-colors cursor-pointer focus:outline-none"
                title="Back to login"
                aria-label="Back to login"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            {/* Centered Brand Logo */}
            <div className="flex flex-col items-center justify-center mb-4 text-center">
              <EviaLogo size="md" className="justify-center" />
            </div>

            {/* Regulatory Designation & Tagline placed before Welcome */}
            <div className="flex flex-col items-center justify-center text-center mb-5">
              <div className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[rgba(212,175,55,0.09)] via-[rgba(212,175,55,0.18)] to-[rgba(212,175,55,0.09)] border border-[rgba(212,175,55,0.4)] shadow-[0_4px_20px_rgba(212,175,55,0.12)]">
                <p className="text-[11.5px] sm:text-[12.5px] font-bold tracking-[0.07em] sm:tracking-[0.09em] text-[#f4ebc1] uppercase leading-snug">
                  YOUR WEALTH ARTIST, AMFI REGISTERED MUTUAL FUND DISTRIBUTOR
                </p>
              </div>
            </div>

            {/* Heading "Welcome!" */}
            <h2 className="text-[24px] font-semibold text-white text-center mb-6 leading-tight">
              {mode === "password"
                ? "Welcome!"
                : mode === "otp"
                ? "OTP Sign In"
                : "Reset Password"}
            </h2>

            {/* Success state banner */}
            {loginSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span className="text-xs font-medium">
                  Authentication successful. Entering portal...
                </span>
              </div>
            )}

            {/* ============================================================== */}
            {/* 3) MAIN FORM: Standard Username & Password                     */}
            {/* ============================================================== */}
            {mode === "password" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* Username Field */}
                <div>
                  <label className="block text-[13px] font-medium text-white/70 mb-1.5 text-left">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (usernameError) setUsernameError(false);
                    }}
                    placeholder="Enter your username or client ID"
                    className={`w-full h-11 px-3.5 rounded-[10px] bg-white/[0.04] border text-sm text-white placeholder-white/30 transition-all outline-none ${
                      usernameError
                        ? "border-[#e0566b] focus:border-[#e0566b] focus:ring-2 focus:ring-[#e0566b]/20"
                        : "border-white/[0.14] focus:border-[rgba(212,175,55,0.6)] focus:ring-3 focus:ring-[rgba(212,175,55,0.18)]"
                    }`}
                  />
                  {usernameError && (
                    <p className="mt-1 text-left text-[12px] text-[#e0566b] font-medium">
                      Required
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-[13px] font-medium text-white/70 mb-1.5 text-left">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError(false);
                      }}
                      placeholder="••••••••••••"
                      className={`w-full h-11 pl-3.5 pr-11 rounded-[10px] bg-white/[0.04] border text-sm text-white placeholder-white/30 transition-all outline-none ${
                        passwordError
                          ? "border-[#e0566b] focus:border-[#e0566b] focus:ring-2 focus:ring-[#e0566b]/20"
                          : "border-white/[0.14] focus:border-[rgba(212,175,55,0.6)] focus:ring-3 focus:ring-[rgba(212,175,55,0.18)]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/90 transition-colors p-1 focus:outline-none cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {/* Validation error below password */}
                  {passwordError && (
                    <p className="mt-1 text-left text-[12px] text-[#e0566b] font-medium">
                      Required
                    </p>
                  )}
                </div>

                {/* Row: Remember Me + Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-white/70 hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/[0.06] text-[#d4af37] accent-[#d4af37] focus:ring-0 cursor-pointer"
                    />
                    <span>Remember Me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-[#d9c56e] hover:text-[#f6e7b4] hover:underline font-medium transition-colors cursor-pointer focus:outline-none"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Log in Button: Full-width gold-gradient pill */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[46px] rounded-full bg-gradient-to-r from-[#ebe0a6] via-[#d4c06e] to-[#a89537] text-black font-semibold text-[15px] shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_28px_rgba(212,175,55,0.45)] hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer mt-2 disabled:opacity-70"
                >
                  {isSubmitting ? "Authenticating..." : "Log in"}
                </button>

                {/* Terms of Use Acceptance */}
                <p className="text-center text-[11.5px] text-white/55 leading-relaxed pt-1">
                  By logging in, you confirm acceptance of our{" "}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate("/contact");
                    }}
                    className="text-[#d9c56e] hover:underline font-medium cursor-pointer"
                  >
                    Terms of Use
                  </button>
                  .
                </p>

                {/* Divider with "OR" */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-white/[0.12]" />
                  <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                    OR
                  </span>
                  <div className="flex-1 h-px bg-white/[0.12]" />
                </div>

                {/* Log in with OTP Button */}
                <button
                  type="button"
                  onClick={() => setMode("otp")}
                  className="w-full h-11 rounded-full border border-white/[0.18] bg-transparent hover:bg-white/[0.05] hover:border-white/30 text-white text-[13.5px] font-medium flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-[#d4af37]" />
                  <span>Log in with OTP</span>
                </button>

                {/* Sign in with Google Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitting(true);
                    setTimeout(() => {
                      setIsSubmitting(false);
                      setLoginSuccess(true);
                      setTimeout(() => {
                        onClose();
                        setLoginSuccess(false);
                      }, 1500);
                    }, 800);
                  }}
                  className="w-full h-11 rounded-full border border-white/[0.18] bg-transparent hover:bg-white/[0.05] hover:border-white/30 text-white text-[13.5px] font-medium flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                >
                  {/* Multi-color Google G icon */}
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              </form>
            )}

            {/* ============================================================== */}
            {/* SUB-MODE: Log in with OTP                                      */}
            {/* ============================================================== */}
            {mode === "otp" && (
              <div className="space-y-4">
                {!otpCodeSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-[13px] font-medium text-white/70 mb-1.5 text-left">
                        Registered Mobile or Email
                      </label>
                      <input
                        type="text"
                        value={otpTarget}
                        onChange={(e) => {
                          setOtpTarget(e.target.value);
                          if (otpTargetError) setOtpTargetError(false);
                        }}
                        placeholder="e.g. +91 9330183973 or user@eviawealth.com"
                        className={`w-full h-11 px-3.5 rounded-[10px] bg-white/[0.04] border text-sm text-white placeholder-white/30 transition-all outline-none ${
                          otpTargetError
                            ? "border-[#e0566b] focus:border-[#e0566b]"
                            : "border-white/[0.14] focus:border-[rgba(212,175,55,0.6)] focus:ring-3 focus:ring-[rgba(212,175,55,0.18)]"
                        }`}
                      />
                      {otpTargetError && (
                        <p className="mt-1 text-left text-[12px] text-[#e0566b] font-medium">
                          Required
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full h-[46px] rounded-full bg-gradient-to-r from-[#ebe0a6] via-[#d4c06e] to-[#a89537] text-black font-semibold text-[15px] shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_28px_rgba(212,175,55,0.45)] hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
                    >
                      Send One-Time Password
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
                    <p className="text-xs text-white/70 leading-relaxed">
                      A 6-digit verification code has been sent to{" "}
                      <span className="text-[#f6e7b4] font-medium">{otpTarget}</span>
                    </p>

                    <div className="flex justify-center gap-2 my-2">
                      {otpCode.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-box-${idx}`}
                          type="text"
                          maxLength={1}
                          defaultValue={idx === 0 ? "8" : idx === 1 ? "4" : ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            const next = [...otpCode];
                            next[idx] = val;
                            setOtpCode(next);
                            if (val && idx < 5) {
                              const nextInput = document.getElementById(`otp-box-${idx + 1}`);
                              if (nextInput) (nextInput as HTMLInputElement).focus();
                            }
                          }}
                          className="w-10 h-12 text-center bg-white/[0.06] border border-white/20 rounded-xl text-white font-mono font-bold text-lg focus:border-[rgba(212,175,55,0.8)] focus:ring-2 focus:ring-[rgba(212,175,55,0.25)] outline-none"
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-[46px] rounded-full bg-gradient-to-r from-[#ebe0a6] via-[#d4c06e] to-[#a89537] text-black font-semibold text-[15px] shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_28px_rgba(212,175,55,0.45)] hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
                    >
                      {isSubmitting ? "Verifying..." : "Verify & Log in"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setOtpCodeSent(false)}
                      className="text-xs text-[#d9c56e] hover:underline"
                    >
                      Resend code
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* SUB-MODE: Forgot Password                                      */}
            {/* ============================================================== */}
            {mode === "forgot" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Password reset link has been dispatched to your registered address.");
                  setMode("password");
                }}
                className="space-y-4"
              >
                <p className="text-xs text-white/60 leading-relaxed text-left">
                  Enter your registered username or email address and we'll send you an encrypted recovery link.
                </p>
                <div>
                  <label className="block text-[13px] font-medium text-white/70 mb-1.5 text-left">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@eviawealth.com"
                    className="w-full h-11 px-3.5 rounded-[10px] bg-white/[0.04] border border-white/[0.14] text-sm text-white placeholder-white/30 focus:border-[rgba(212,175,55,0.6)] focus:ring-3 focus:ring-[rgba(212,175,55,0.18)] outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-[46px] rounded-full bg-gradient-to-r from-[#ebe0a6] via-[#d4c06e] to-[#a89537] text-black font-semibold text-[15px] shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_28px_rgba(212,175,55,0.45)] transition-all cursor-pointer"
                >
                  Send Recovery Link
                </button>
              </form>
            )}

            {/* ============================================================== */}
            {/* BOTTOM SECTION: Contact Us & Download The App                  */}
            {/* ============================================================== */}
            <div className="pt-6 mt-6 border-t border-white/[0.08] text-center space-y-4">
              {/* "Got a question? Contact us" */}
              <p className="text-[12.5px] text-white/55">
                Got a question?{" "}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate("/contact");
                  }}
                  className="text-[#d9c56e] font-medium hover:text-[#f6e7b4] hover:underline cursor-pointer focus:outline-none"
                >
                  Contact us
                </button>
              </p>

              {/* "Download the App" */}
              <div>
                <span className="block text-[11px] font-medium text-white/50 uppercase tracking-widest mb-3">
                  Download the App
                </span>

                {/* App Store and Google Play Badges Side by Side */}
                <div className="flex items-center justify-center gap-2.5">
                  {/* Apple App Store Badge */}
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black border border-white/20 hover:border-[#cdb864]/60 transition-all text-left shadow-sm group"
                    title="Download on the App Store"
                  >
                    <svg className="w-5 h-5 fill-white shrink-0 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.64-.78 1.08-1.86.96-2.95-1 .04-2.14.65-2.81 1.43-.59.68-1.11 1.77-.97 2.84 1.11.09 2.18-.55 2.82-1.32z" />
                    </svg>
                    <div className="flex flex-col leading-none">
                      <span className="text-[8px] text-white/60 tracking-tight">Download on the</span>
                      <span className="text-[11px] font-semibold text-white tracking-tight">App Store</span>
                    </div>
                  </a>

                  {/* Google Play Store Badge */}
                  <a
                    href="https://play.google.com/store/apps/details?id=com.tvs.investwell"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black border border-white/20 hover:border-[#cdb864]/60 transition-all text-left shadow-sm group cursor-pointer"
                    title="Get it on Google Play"
                  >
                    <svg className="w-5 h-5 shrink-0 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M3.6 1.4L13.8 11.6L3.6 21.8C3.2 21.3 3 20.6 3 19.6V3.6C3 2.6 3.2 1.9 3.6 1.4Z" />
                      <path fill="#FBBC04" d="M17.4 8L13.8 11.6L17.4 15.2L20.8 13.3C21.7 12.8 21.7 11.8 20.8 11.3L17.4 8Z" />
                      <path fill="#EA4335" d="M13.8 11.6L3.6 1.4C4.1 0.9 4.9 0.7 5.7 1.1L17.4 7.9L13.8 11.6Z" />
                      <path fill="#34A853" d="M13.8 11.6L17.4 15.2L5.7 22C4.9 22.4 4.1 22.2 3.6 21.8L13.8 11.6Z" />
                    </svg>
                    <div className="flex flex-col leading-none">
                      <span className="text-[8px] text-white/60 tracking-tight">GET IT ON</span>
                      <span className="text-[11px] font-semibold text-white tracking-tight">Google Play</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

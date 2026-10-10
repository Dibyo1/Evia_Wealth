import React, { useState, useEffect } from "react";
import { MapPin, Mail, Phone, ArrowLeft, X, ChevronRight, Check, Send } from "lucide-react";
import { motion } from "motion/react";
import { useNavigation } from "../../context/NavigationContext";

interface ContactUsViewProps {
  onReviewPortfolio: () => void;
  onLoginClick?: () => void;
}

export default function ContactUsView({}: ContactUsViewProps) {
  const { navigate } = useNavigation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    productInterested: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setFormData({
          fullName: "",
          phoneNumber: "",
          emailAddress: "",
          productInterested: "",
          message: "",
        });
        setSubmitted(false);
      }, 3500);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#34d399]/30 selection:text-emerald-300 relative overflow-hidden">
      {/* 1. PAGE HEADER / HERO BANNER */}
      <section className="relative pt-[112px] pb-14 sm:pb-20 border-b border-white/[0.08] overflow-hidden">
        {/* Soft dark-green radial glow behind page title */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[360px] sm:h-[460px] rounded-full blur-[140px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(16,185,129,0.10) 0%, rgba(16,185,129,0.02) 60%, transparent 80%)",
          }}
        />

        {/* Subtle, darkened, low-opacity texture (abstract geometric/city skyline grid at ~8% opacity) */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(212, 175, 55, 0.4) 1px, transparent 1px), radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
            backgroundPosition: "0 0, 18px 18px",
          }}
        />

        <div className="relative z-10 max-w-[1240px] mx-auto px-5 sm:px-8">
          {/* Breadcrumb + Close / Back Action */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider text-white/50"
            >
              <button
                onClick={() => navigate("/")}
                className="hover:text-[#f1e7b4] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-[#d4af37]/60" />
              <span className="text-[#f1e7b4] font-medium">Contact</span>
            </motion.div>

            {/* Close / Return Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              onClick={() => navigate("/")}
              aria-label="Close Contact Us and return to Home"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#d9c56e]/40 text-[#c4c0b8] hover:text-[#f1e7b4] text-xs font-medium transition-all duration-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Close</span>
            </motion.button>
          </div>

          {/* Section Eyebrow Pill: Mint dot + CONTACT US */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mb-5"
          >
            <div className="gold-eyebrow-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(212,175,55,0.3)] bg-[#121214] shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
              <span className="text-[11.5px] font-semibold tracking-wider text-[#e6d78a] uppercase">
                CONTACT US
              </span>
            </div>
          </motion.div>

          {/* Page Title: Gold Gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-[38px] sm:text-[50px] md:text-[62px] font-bold tracking-tight leading-[1.1] mb-4 font-['Poppins']"
            style={{
              background:
                "linear-gradient(90deg, #ebe0a6 0%, #d4c06e 35%, #b9a13f 70%, #a89537 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            Contact Us
          </motion.h1>

          {/* Breadcrumb subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="text-xs uppercase tracking-widest text-white/50 font-medium"
          >
            Home / Contact
          </motion.div>
        </div>
      </section>

      {/* 2. TWO-COLUMN BODY SECTION */}
      <section className="py-16 sm:py-24 relative">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column — Address & Contact Info (5 cols on lg) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 flex flex-col"
            >
              <div className="mb-6">
                <span className="text-[12px] font-bold uppercase tracking-widest text-[#d9c56e] block mb-2 font-['Poppins']">
                  Come Visit Us At
                </span>
                <h2 className="text-[28px] sm:text-[32px] font-semibold text-white font-['Poppins'] leading-tight">
                  Our Address
                </h2>
              </div>

              {/* Address Dark Card */}
              <div className="rounded-[20px] bg-[#0e0e0f] border border-white/[0.08] p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.6)] space-y-6 relative overflow-hidden">
                {/* Subtle top corner ambient glow */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-[#d4c06e]/5 rounded-full blur-[60px] pointer-events-none" />

                {/* Info Row 1: Registered Office */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center shrink-0 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold text-white leading-tight mb-1 font-['Poppins']">
                      Registered Office
                    </h3>
                    <p className="text-[14px] text-white/65 leading-relaxed font-normal">
                      Evia Wealth Private Limited, Unit 521, 5th Floor, Regus Offices, Salt Lake Sector V, Bidhannagar, P.S Electronics Complex – 700091
                    </p>
                  </div>
                </div>

                <div className="h-px bg-white/[0.06] w-full" />

                {/* Info Row 2: Our Email */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center shrink-0 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold text-white leading-tight mb-1 font-['Poppins']">
                      Our Email
                    </h3>
                    <a
                      href="mailto:info@eviawealth.com"
                      className="text-[14px] text-white/65 hover:text-[#f1e7b4] transition-colors leading-relaxed font-normal block"
                    >
                      info@eviawealth.com
                    </a>
                  </div>
                </div>

                <div className="h-px bg-white/[0.06] w-full" />

                {/* Info Row 3: Our Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center shrink-0 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold text-white leading-tight mb-1 font-['Poppins']">
                      Our Phone
                    </h3>
                    <a
                      href="tel:+919330183973"
                      className="text-[14px] text-white/65 hover:text-[#f1e7b4] transition-colors leading-relaxed font-normal block"
                    >
                      +91 9330183973
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column — Send Message / Drop Us A Line Form (7 cols on lg) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-7 flex flex-col"
            >
              <div className="mb-6">
                <span className="text-[12px] font-bold uppercase tracking-widest text-[#d9c56e] block mb-2 font-['Poppins']">
                  Send Message
                </span>
                <h2 className="text-[28px] sm:text-[32px] font-semibold text-white font-['Poppins'] leading-tight">
                  Drop Us A Line
                </h2>
              </div>

              {/* Form Dark Card */}
              <div className="rounded-[20px] bg-[#0e0e0f] border border-white/[0.08] p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
                {/* Subtle top corner ambient glow */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-[#d4c06e]/5 rounded-full blur-[60px] pointer-events-none" />

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                  {/* Row 1: Full Name* & Phone Number* */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[13px] font-medium text-white/80 mb-2 font-['Poppins']">
                        Full Name*
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        placeholder="John Doe"
                        className="w-full h-12 px-4 rounded-[10px] bg-[#0a0a0a] border border-white/[0.12] text-white placeholder-white/40 text-[14px] font-normal transition-all duration-200 outline-none focus:border-[rgba(212,175,55,0.6)] focus:ring-1 focus:ring-[rgba(212,175,55,0.4)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-white/80 mb-2 font-['Poppins']">
                        Phone Number*
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, phoneNumber: e.target.value })
                        }
                        placeholder="+91 98765 43210"
                        className="w-full h-12 px-4 rounded-[10px] bg-[#0a0a0a] border border-white/[0.12] text-white placeholder-white/40 text-[14px] font-normal transition-all duration-200 outline-none focus:border-[rgba(212,175,55,0.6)] focus:ring-1 focus:ring-[rgba(212,175,55,0.4)]"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email Address* & Choose Products Interested */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[13px] font-medium text-white/80 mb-2 font-['Poppins']">
                        Email Address*
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.emailAddress}
                        onChange={(e) =>
                          setFormData({ ...formData, emailAddress: e.target.value })
                        }
                        placeholder="john@example.com"
                        className="w-full h-12 px-4 rounded-[10px] bg-[#0a0a0a] border border-white/[0.12] text-white placeholder-white/40 text-[14px] font-normal transition-all duration-200 outline-none focus:border-[rgba(212,175,55,0.6)] focus:ring-1 focus:ring-[rgba(212,175,55,0.4)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-white/80 mb-2 font-['Poppins']">
                        Choose Products Interested
                      </label>
                      <select
                        value={formData.productInterested}
                        onChange={(e) =>
                          setFormData({ ...formData, productInterested: e.target.value })
                        }
                        className="w-full h-12 px-4 rounded-[10px] bg-[#0a0a0a] border border-white/[0.12] text-white text-[14px] font-normal transition-all duration-200 outline-none focus:border-[rgba(212,175,55,0.6)] focus:ring-1 focus:ring-[rgba(212,175,55,0.4)] cursor-pointer"
                      >
                        <option value="" className="bg-[#121214] text-white/50">
                          Select a Product or Service
                        </option>
                        <option value="portfolio-solutions" className="bg-[#121214] text-white">
                          Portfolio Solutions
                        </option>
                        <option value="investment-products" className="bg-[#121214] text-white">
                          Investment Products
                        </option>
                        <option value="wealth-planning" className="bg-[#121214] text-white">
                          Wealth Planning
                        </option>
                        <option value="real-estate" className="bg-[#121214] text-white">
                          Real Estate
                        </option>
                        <option value="lending-solutions" className="bg-[#121214] text-white">
                          Lending Solutions
                        </option>
                        <option value="special-privileges" className="bg-[#121214] text-white">
                          Special Privileges
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Write A Message... */}
                  <div>
                    <label className="block text-[13px] font-medium text-white/80 mb-2 font-['Poppins']">
                      Write A Message...
                    </label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Tell us about your portfolio or advisory requirements..."
                      className="w-full p-4 rounded-[10px] bg-[#0a0a0a] border border-white/[0.12] text-white placeholder-white/40 text-[14px] font-normal transition-all duration-200 outline-none focus:border-[rgba(212,175,55,0.6)] focus:ring-1 focus:ring-[rgba(212,175,55,0.4)] resize-none"
                    />
                  </div>

                  {/* Submit Button & Status */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {submitted ? (
                      <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                        <Check className="w-4 h-4" />
                        <span>Message sent successfully! Our advisors will connect shortly.</span>
                      </div>
                    ) : (
                      <span className="text-xs text-white/40 hidden sm:inline">
                        All inquiries are handled with strict institutional confidentiality.
                      </span>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto h-12 px-8 rounded-full gold-pill-btn text-black font-semibold text-[14px] tracking-wide uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_28px_rgba(212,175,55,0.5)] active:scale-[0.98] transition-all duration-150 cursor-pointer shrink-0"
                    >
                      {submitting ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <span>Submit</span>
                          <Send className="w-3.5 h-3.5 text-black" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

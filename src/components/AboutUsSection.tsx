import React from "react";
import { Users, ShieldCheck, Sparkles, Award, Compass } from "lucide-react";
import { motion } from "motion/react";

interface ValueItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const VALUES: ValueItem[] = [
  {
    title: "Client-Centric Approach",
    description:
      "Your goals are our priority. We take the time to understand your individual circumstances and develop customized strategies to meet your financial objectives.",
    icon: Users,
  },
  {
    title: "Integrity and Transparency",
    description:
      "We uphold the highest standards of honesty and transparency in all our interactions, ensuring that you always have a clear understanding of your financial picture.",
    icon: ShieldCheck,
  },
  {
    title: "Expertise and Innovation",
    description:
      "Our team of seasoned professionals leverages their extensive knowledge and the latest financial tools to provide you with cutting-edge solutions.",
    icon: Sparkles,
  },
  {
    title: "Commitment to Excellence",
    description:
      "We are dedicated to delivering exceptional service and results, continuously striving for excellence in everything we do.",
    icon: Award,
  },
];

export default function AboutUsSection() {
  return (
    <section
      id="about"
      className="py-24 sm:py-32 bg-black relative border-t border-white/6 overflow-hidden"
    >
      <div className="max-w-[1160px] mx-auto px-5 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto flex flex-col items-center text-center mb-16 md:mb-20"
        >
          {/* Eyebrow label */}
          <div className="gold-eyebrow-pill mb-6">
            <span className="gold-dot" />
            <span className="gold-eyebrow-text">ABOUT US</span>
          </div>

          {/* Section heading */}
          <h2 className="text-[34px] sm:text-[46px] md:text-[52px] font-bold tracking-[-0.03em] mb-4 gold-gradient-heading leading-[1.14]">
            About us
          </h2>
        </motion.div>

        {/* Two-Column Layout (Desktop: 2 columns, Mobile: stacked) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch mb-16 sm:mb-20">
          {/* Left Column: Two "About us" paragraphs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left"
          >
            <p className="text-[15px] sm:text-[16px] text-[#c4c0b8] leading-[1.75] font-normal">
              The word EVIA is derived from the Greek Word Euboea, which denotes a
              place of historical significance during the ancient times as one the
              largest trade routes to connect the archaeologically and culturally
              important country Greece with the rest of the world. The island&apos;s
              history includes influences from various civilizations known to be
              highly affluent like the Greeks, Romans, Byzantines, and Ottomans.
            </p>

            <p className="text-[15px] sm:text-[16px] text-[#c4c0b8] leading-[1.75] font-normal">
              Evia Wealth Management is laid on a similar foundation and is built
              on similar pillars like that of its real owners. At Evia we believe
              that wealth management is about more than just numbers—it&apos;s about
              empowering you to achieve your financial goals and secure your
              future. With a deep understanding of the financial markets and a
              commitment to personalized service, we are dedicated to helping you
              navigate the complexities of wealth management with confidence. The
              company uses exceptional research, networking, affiliation and
              dynamic resourcing abilities that come from its highly experienced
              team of expert bankers with prolific wealth management experiences
              to bring exceptional results for the clients based on their need.
            </p>
          </motion.div>

          {/* Right Column: "Our Mission" card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="h-full rounded-[24px] bg-[#0d0e12] border border-white/10 hover:border-[#d4c06e]/30 p-7 sm:p-9 shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 group">
              {/* Subtle top ambient glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4c06e]/5 rounded-full blur-[60px] pointer-events-none" />

              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#e2d6a0]/10 border border-[#e2d6a0]/25 text-[#d9c56e] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>

                <h3 className="text-[22px] sm:text-[26px] font-bold tracking-[-0.02em] gold-gradient-heading mb-4 font-['Poppins']">
                  Our Mission
                </h3>

                <p className="text-[14px] sm:text-[15px] text-[#c4c0b8] leading-[1.75] font-normal">
                  Our mission is to provide exceptional wealth management services
                  tailored to your unique needs. We strive to build lasting
                  relationships based on trust, integrity, and transparency. By
                  offering insightful guidance and innovative solutions, we aim
                  to help you grow, protect, and transfer your wealth
                  effectively.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width Sub-block 2: "Our Values" */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <div className="mb-8 text-left">
            <h3 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold tracking-[-0.02em] gold-gradient-heading font-['Poppins']">
              Our Values
            </h3>
          </div>

          {/* 2x2 Grid of Value Cards (1 column on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {VALUES.map((val, idx) => {
              const IconComponent = val.icon;
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.1 * idx,
                  }}
                  className="rounded-[20px] bg-[#0c0d10] border border-white/8 hover:border-[#d4c06e]/35 p-6 sm:p-7 transition-all duration-300 shadow-lg relative group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-[#e2d6a0]/10 border border-[#e2d6a0]/20 flex items-center justify-center text-[#d9c56e] shrink-0 mb-4 group-hover:scale-105 transition-transform">
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <h4 className="text-[16px] sm:text-[17px] font-bold text-white mb-2 font-['Poppins']">
                      {val.title}:
                    </h4>

                    <p className="text-[14px] text-[#c4c0b8] leading-[1.65] font-normal">
                      {val.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

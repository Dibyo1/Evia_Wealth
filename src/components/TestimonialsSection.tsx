import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
}

const testimonials: TestimonialItem[] = [
  {
    id: "1",
    name: "Prof Kalyan Chaudhuri",
    role: "Author: Historian , Madhyamik",
    quote:
      '"Evia Wealth is one of the most unique wealth management propositions in the country. They have strong expertise in every field of wealth management with immaculate execution abilities. The research and guidance to investors is timely and consistent with dynamic market environment resulting in exemplary investor experience. Personally i am banking with all my family portfolios as they provide me a holistic experience."',
    image: "/images/testimonials/kalyan-chaudhuri.jpg",
  },
  {
    id: "2",
    name: "Retired Engineer",
    role: "ADNOC Offshore, UAE",
    quote:
      '"My sincere appreciation to Eviawealth for their dedicated work keeping in view the continuous growth of funds. I admire their way of working following the path of analyzing, innovating and adapting the changing market. The Eviawealth is very collaborative and open minded. I wish Evia to be successful in every sphere of Wealth Management."',
    image: "/images/testimonials/retired-engineer.jpg",
  },
  {
    id: "3",
    name: "Arghya Mandal.",
    role: "CEO, TH Milk, Vietnam.",
    quote:
      '"There is always an opportunity to provide better service , better care, better support to clients. Evia is on its path to make a signature in those lines. My personal experience with Evia is ‘best in class’. Trust and honesty are not only the words in dictionary, it also gets displayed well in Evia style of working together."',
    image: "/images/testimonials/arghya-mandal.jpg",
  },
  {
    id: "4",
    name: "Prof Sugata Mitra.",
    role: "(Retd. 2019) Professor of Educational Technology, Newcastle University, UK",
    quote:
      '"My experience with Evia Wealth has been simply extraordinary. The entire team consists of proficient wealth managers who have consistently demonstrated the use of robust techniques and expertise on portfolio goal alignment. Add to this their exhaustive experience in handling customer services relating to banking , investment , remittances , taxes and legacy planning it offers an all round approach for UHNI\'s who are looking at a one stop solution."',
    image: "/images/testimonials/sugata-mitra.jpg",
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  const goToIndex = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Automatic one-by-one rotation (changes every 10 seconds as requested)
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      goToNext();
    }, 10000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [goToNext, isPaused]);

  const current = testimonials[currentIndex];

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 24 : -24,
    }),
    center: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.65,
        ease: "easeInOut",
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -24 : 24,
      transition: {
        duration: 0.45,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <section className="bg-white text-black py-20 sm:py-24 md:py-28 overflow-hidden select-none rounded-[32px] sm:rounded-[48px] md:rounded-[60px] mx-3 sm:mx-6 lg:mx-8 my-8 sm:my-14 shadow-2xl border border-neutral-200/40">
      <div className="max-w-[1120px] mx-auto px-5 sm:px-8">
        
        {/* Section Heading */}
        <h2 className="text-[32px] sm:text-[38px] md:text-[44px] font-bold text-[#101A33] text-center tracking-tight mb-12 sm:mb-16">
          Testimonials
        </h2>

        {/* Testimonial Presentation Container with Controls */}
        <div
          className="relative max-w-[980px] mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Fixed Vertical Alignment for Left / Right Navigation Buttons:
              Pinned to the horizontal axis of the avatar photo (top-[56px] -translate-y-1/2)
              so they NEVER move upwards or downwards when testimonials of different lengths resize */}
          <div className="hidden sm:flex items-center justify-between absolute top-[56px] -translate-y-1/2 -left-4 -right-4 lg:-left-12 lg:-right-12 z-20 pointer-events-none">
            <button
              onClick={goToPrev}
              className="w-10 h-10 rounded-full border border-gray-200/90 bg-white/95 hover:bg-white text-gray-700 hover:text-black flex items-center justify-center shadow-xs hover:shadow-md transition-all cursor-pointer pointer-events-auto"
              title="Previous testimonial"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 -translate-x-0.5" />
            </button>
            <button
              onClick={goToNext}
              className="w-10 h-10 rounded-full border border-gray-200/90 bg-white/95 hover:bg-white text-gray-700 hover:text-black flex items-center justify-center shadow-xs hover:shadow-md transition-all cursor-pointer pointer-events-auto"
              title="Next testimonial"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 translate-x-0.5" />
            </button>
          </div>

          {/* Dynamic Resizing Content Wrapper:
              Allows the div/section to change height naturally according to each testimonial's text size */}
          <div className="relative w-full flex items-center justify-center transition-all duration-500 ease-out">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full flex flex-col items-center text-center"
              >
                {/* 1. Circular Portrait */}
                <div className="w-[100px] h-[100px] sm:w-[112px] sm:h-[112px] rounded-full p-1 border border-gray-200/80 bg-white shadow-xs flex items-center justify-center mb-8 sm:mb-9 shrink-0">
                  <img
                    src={current.image}
                    alt={current.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center rounded-full"
                    loading="eager"
                  />
                </div>

                {/* 2. Testimonial Paragraph */}
                <p className="text-[17px] sm:text-[19px] md:text-[21px] italic font-normal text-[#555] leading-[1.55] sm:leading-[1.6] max-w-[940px] px-2 sm:px-6 mb-7 sm:mb-8 font-sans">
                  {current.quote}
                </p>

                {/* 3. Five Gold/Yellow Stars */}
                <div
                  className="text-[#F4C400] text-[20px] sm:text-[22px] tracking-[2px] leading-none mb-5 sm:mb-6 select-none"
                  aria-label="5 out of 5 stars"
                >
                  ★★★★★
                </div>

                {/* 4. Person Name */}
                <h3 className="text-[20px] sm:text-[22px] md:text-[23px] font-bold text-[#101A33] tracking-tight mb-1 sm:mb-1.5">
                  {current.name}
                </h3>

                {/* 5. Designation / Role */}
                <p className="text-[15px] sm:text-[16px] md:text-[17px] font-normal text-[#555] tracking-normal">
                  {current.role}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Minimal Pagination Dots & Mobile Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8 sm:mt-10">
            <button
              onClick={goToPrev}
              className="sm:hidden w-8 h-8 rounded-full border border-gray-200 bg-white text-gray-700 flex items-center justify-center shadow-xs cursor-pointer"
              title="Previous testimonial"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? "w-7 bg-[#101A33]"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                  title={`Testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="sm:hidden w-8 h-8 rounded-full border border-gray-200 bg-white text-gray-700 flex items-center justify-center shadow-xs cursor-pointer"
              title="Next testimonial"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

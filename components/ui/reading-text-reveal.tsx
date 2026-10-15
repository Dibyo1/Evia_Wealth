"use client";

import React, { useRef, useEffect, useState } from "react";

export interface ReadingTextRevealProps {
  storySegments?: string[];
  endText?: string;
  scrollSpeed?: "slow" | "slower" | "normal" | "fast";
  minHeightMultiplier?: number;
  className?: string;
}

const DEFAULT_STORY_SEGMENTS = [
  "So there I was, 3 AM on a Tuesday, debugging code that I swore worked perfectly just six hours ago.",
  "My client had just sent their fourth 'quick question' of the night.",
  "The coffee machine broke at midnight. This was not ideal.",
  "I realized I'd been wearing the same hoodie for three days straight. My cat had stopped judging me. That's when I knew things were serious.",
  "The client wanted 'just a small change' to the entire backend architecture. No big deal, right?",
  "I quoted them two weeks. They needed it by Friday. It was already Wednesday.",
  "My inbox had 47 unread messages. 43 of them started with 'Hey, quick question...'",
  "I discovered I'd been on mute during the entire client call. For 45 minutes, I'd been passionately explaining solutions to absolutely no one.",
  "The 'final' revision was revision number 23. The optimist in me died somewhere around revision 11.",
  "But you know what? I shipped it. On time. It actually worked.",
  "The client loved it. Five stars. Would definitely send more 'quick questions' at 3 AM again.",
  "This is the life. This is freelancing. This is why I'll never go back to a regular job.",
  "At least my cat respects me again."
];

export const Component: React.FC<ReadingTextRevealProps> = ({
  storySegments = DEFAULT_STORY_SEGMENTS,
  endText = "The End",
  scrollSpeed = "slow",
  minHeightMultiplier,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealedWordCount, setRevealedWordCount] = useState(0);

  const allWords = storySegments.flatMap((segment) => segment.split(" "));
  const totalWords = allWords.length;

  // Compute scroll height to control speed: higher min-height slows down words per pixel scrolled
  const speedConfig = {
    slower: { lerp: 0.035, vh: 900 },
    slow: { lerp: 0.05, vh: 750 },
    normal: { lerp: 0.09, vh: 550 },
    fast: { lerp: 0.12, vh: 400 },
  }[scrollSpeed] || { lerp: 0.05, vh: 750 };

  const computedMinHeight = minHeightMultiplier
    ? `${Math.round(speedConfig.vh * minHeightMultiplier)}vh`
    : `${speedConfig.vh}vh`;

  useEffect(() => {
    let rafId: number | null = null;
    let targetProgress = 0;
    let currentProgress = 0;

    const smoothScroll = () => {
      const difference = targetProgress - currentProgress;
      // Controlled, gentle smoothing factor for slow, silky progress
      currentProgress += difference * speedConfig.lerp;

      if (Math.abs(targetProgress - currentProgress) > 0.0005) {
        const wordsToReveal = Math.floor(currentProgress * totalWords);
        setRevealedWordCount(wordsToReveal);
        rafId = requestAnimationFrame(smoothScroll);
      } else {
        setRevealedWordCount(Math.floor(targetProgress * totalWords));
      }
    };

    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Eye-level tracking line for natural reading gaze
      const eyeLevel = windowHeight * 0.60;

      const animationStart = rect.top + window.scrollY - eyeLevel;
      const animationEnd = rect.top + window.scrollY + rect.height - eyeLevel;
      const scrollDistance = Math.max(animationEnd - animationStart, 1);
      const currentScroll = window.scrollY;

      const progress = (currentScroll - animationStart) / scrollDistance;
      targetProgress = Math.max(0, Math.min(1, progress));

      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(smoothScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [totalWords, speedConfig.lerp]);

  let wordIndex = 0;

  return (
    <div
      className={`bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-black dark:via-neutral-950 dark:to-black transition-colors duration-500 ${className}`}
    >
      {/* Content */}
      <div
        ref={containerRef}
        className="max-w-5xl mx-auto px-6 sm:px-8 pt-24 sm:pt-32 pb-32"
        style={{ minHeight: computedMinHeight }}
      >
        <div className="space-y-12 sm:space-y-16">
          {storySegments.map((segment, segmentIndex) => {
            const segmentWords = segment.split(" ");
            const segmentStartIndex = wordIndex;
            wordIndex += segmentWords.length;

            return (
              <p
                key={segmentIndex}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight select-none"
                style={{
                  fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                  fontWeight: 600,
                }}
              >
                {segmentWords.map((word, i) => {
                  const currentWordIndex = segmentStartIndex + i;
                  const isRevealed = currentWordIndex < revealedWordCount;
                  return (
                    <span
                      key={i}
                      className={
                        isRevealed
                          ? "text-black dark:text-white"
                          : "text-gray-400/50 dark:text-gray-600/40"
                      }
                      style={{
                        transition: "color 0.4s ease-out, opacity 0.4s ease-out",
                        opacity: isRevealed ? 1 : 0.35,
                      }}
                    >
                      {word}{" "}
                    </span>
                  );
                })}
              </p>
            );
          })}
        </div>
      </div>

      {/* Bottom space */}
      <div style={{ height: "60vh" }} />

      {/* Footer */}
      <div className="pb-24 pt-12 text-center">
        <p
          className="text-7xl sm:text-8xl md:text-9xl tracking-tight text-gray-400 dark:text-gray-600 select-none"
          style={{
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
            fontWeight: 600,
          }}
        >
          {endText}
        </p>
      </div>
    </div>
  );
};

export const ReadingTextReveal = Component;
export default Component;

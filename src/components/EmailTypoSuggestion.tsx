import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { suggestEmailCorrection } from "../utils/emailTypoDetector";

interface EmailTypoSuggestionProps {
  email: string;
  onAccept: (correctedEmail: string) => void;
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function EmailTypoSuggestion({
  email,
  onAccept,
  className = "",
  inputRef,
}: EmailTypoSuggestionProps) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear any pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // If the input changed away from the dismissed string, reset dismissed state
    if (dismissedFor && email !== dismissedFor) {
      setDismissedFor(null);
    }

    // Debounce typo detection by 250ms to avoid unnecessary calculations during typing
    debounceTimerRef.current = setTimeout(() => {
      // If user dismissed this exact string, don't re-show
      if (email === dismissedFor) {
        setSuggestion(null);
        return;
      }

      const corrected = suggestEmailCorrection(email);
      setSuggestion(corrected);
    }, 250);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [email, dismissedFor]);

  const handleAccept = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (!suggestion) return;
    const acceptedEmail = suggestion;
    setSuggestion(null);
    setDismissedFor(null);
    onAccept(acceptedEmail);

    // Return focus naturally to the input field without layout jump
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleDismiss = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDismissedFor(email);
    setSuggestion(null);
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAccept(e);
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleDismiss(e);
    }
  };

  return (
    <AnimatePresence>
      {suggestion && (
        <motion.div
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`overflow-hidden ${className}`}
          role="status"
          aria-live="polite"
        >
          <div
            className="flex items-center flex-wrap gap-1.5 py-1.5 px-3 mt-1.5 rounded-lg bg-[#141416]/95 border border-[rgba(212,175,55,0.28)] shadow-[0_2px_12px_rgba(0,0,0,0.5)] text-[12px] text-neutral-300 leading-snug w-full select-none"
          >
            <span className="text-neutral-400">Did you mean</span>
            <button
              type="button"
              onClick={handleAccept}
              onKeyDown={handleButtonKeyDown}
              title="Click or press Enter to apply suggested email"
              aria-label={`Apply suggested email correction: ${suggestion}`}
              className="text-[#f6e7b4] hover:text-white font-medium underline underline-offset-2 decoration-[rgba(212,175,55,0.6)] hover:decoration-white transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[rgba(212,175,55,0.7)] focus:ring-offset-1 focus:ring-offset-black rounded px-1 -mx-0.5 break-all max-w-[calc(100%-110px)] truncate sm:max-w-none inline-block text-left"
            >
              {suggestion}
            </button>
            <span className="text-neutral-400">?</span>

            {/* Subtle dismiss button */}
            <button
              type="button"
              onClick={handleDismiss}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
                  e.preventDefault();
                  handleDismiss(e);
                }
              }}
              title="Dismiss suggestion (Esc)"
              aria-label="Dismiss email suggestion"
              className="ml-auto text-neutral-500 hover:text-neutral-300 p-0.5 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-white/20 cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useEffect, useRef } from "react"
import { initHelpStack } from "./help-stack-engine"
import { helpStackHTML } from "./help-stack-markup"
import "./help-stack.css"

interface StackSectionProps {
  onAnalyseClick: () => void;
  onTalkClick: () => void;
}

/**
 * "How Evia Wealth can help you" + the two stacking cards.
 *   card A pins → its 3 steps play while you scroll → card B slides up over it (A scales down + dims)
 *   → card B pins → releases → next section follows with no dead space.
 *
 * Usage:  <HelpStack />   (replace your current "help you" heading + cards with this ONE component)
 * Copy (headings, list items, buttons) lives in help-stack-markup.ts.
 */
export default function HelpStack({ onAnalyseClick, onTalkClick }: StackSectionProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return

    // Wire up CTA buttons in the injected HTML to React props for interactive modal routing
    const analyseBtns = ref.current.querySelectorAll('.hs-btn:not(.hs-btn--ghost)');
    const handleAnalyseClick = (e: Event) => {
      e.preventDefault();
      onAnalyseClick();
    };
    analyseBtns.forEach((btn) => {
      btn.addEventListener('click', handleAnalyseClick);
    });

    const talkBtns = ref.current.querySelectorAll('.hs-btn--ghost');
    const handleTalkClick = (e: Event) => {
      e.preventDefault();
      onTalkClick();
    };
    talkBtns.forEach((btn) => {
      btn.addEventListener('click', handleTalkClick);
    });

    const cleanup = initHelpStack(ref.current)

    return () => {
      cleanup();
      analyseBtns.forEach((btn) => {
        btn.removeEventListener('click', handleAnalyseClick);
      });
      talkBtns.forEach((btn) => {
        btn.removeEventListener('click', handleTalkClick);
      });
    };
  }, [onAnalyseClick, onTalkClick])

  // markup is static and owned by help-stack-markup.ts, so React never needs to re-render it
  return <section ref={ref} id="solutions" className="hs" dangerouslySetInnerHTML={{ __html: helpStackHTML() }} />
}

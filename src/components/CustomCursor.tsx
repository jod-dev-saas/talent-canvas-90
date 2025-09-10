"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface CustomCursorProps {
  children: React.ReactNode;
}

/**
 * CustomCursor component that creates an adaptive cursor following motion.dev patterns
 * Cursor size adapts based on hover target: small (text), medium (buttons), large (cards)
 * - Adds an inner blue dot + a subtle reading guide bar when hovering text
 * - Uses CSS variable fallback `--cursor-accent` or `#1e90ff`
 * - Respects prefers-reduced-motion and hides on touch devices
 */
export function CustomCursor({ children }: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const readingLineRef = useRef<HTMLDivElement | null>(null);
  const prevHoveredEl = useRef<Element | null>(null);

  // Motion values for smooth cursor movement & sizes
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorSize = useMotionValue(16);
  const innerDotOpacity = useMotionValue(0); // opacity of inner dot when hovering text

  // Springs for smooth animation
  const springX = useSpring(cursorX, { stiffness: 300, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 300, damping: 28 });
  const springSize = useSpring(cursorSize, { stiffness: 400, damping: 40 });
  const springInnerOpacity = useSpring(innerDotOpacity, { stiffness: 300, damping: 35 });

  useEffect(() => {
    // Hide on touch devices
    const isTouchDevice =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    if (isTouchDevice) return; // do nothing on touch devices

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Utility: map element under pointer to cursor size & inner dot state
    const textSelectors =
      "p, span, li, h1, h2, h3, h4, h5, h6, blockquote, pre, code, em, strong";

    const getSizeAndInner = (el: Element | null) => {
      if (!el) return { size: 16, inner: 0 };

      // If inside interactive control (link/button), show medium cursor
      if (el.closest && el.closest("button, a, [role='button'], input, textarea, select")) {
        return { size: 32, inner: 0 };
      }

      // Card-like containers
      if (el.closest && el.closest(".card, [data-card], .panel")) {
        return { size: 48, inner: 0 };
      }

      // Text elements -> smaller cursor + inner dot & reading guide appear
      if (el.closest && el.closest(textSelectors)) {
        return { size: 5, inner: 1 };
      }

      // Default
      return { size: 16, inner: 0 };
    };

    const handleMove = (e: MouseEvent) => {
      // Move cursor origin to pointer center
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Find element directly under pointer (more robust than pointerenter events)
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const { size, inner } = getSizeAndInner(el);

      cursorSize.set(size);
      innerDotOpacity.set(inner);

      // Update reading line position imperatively for crisp position under cursor (slight vertical offset)
      if (readingLineRef.current) {
        readingLineRef.current.style.left = `${e.clientX}px`;
        readingLineRef.current.style.top = `${e.clientY + 18}px`; // 18px below cursor
        readingLineRef.current.style.opacity = inner ? "1" : "0";
      }

      // Manage hovered text class to improve readability
      try {
        // Remove previous class
        if (prevHoveredEl.current && prevHoveredEl.current !== el) {
          (prevHoveredEl.current as HTMLElement).classList.remove("jod-text-hover");
          prevHoveredEl.current = null;
        }

        if (inner && el) {
          // If the exact element is a text node child (e.g., <span> inside <p>), find the nearest text element
          let target: Element | null = el;
          // If the element is not a textual element itself, look up to find one in the selectors
          if (!target.matches || !target.matches(textSelectors)) {
            target = target.closest(textSelectors);
          }

          if (target && target !== prevHoveredEl.current) {
            (target as HTMLElement).classList.add("jod-text-hover");
            prevHoveredEl.current = target;
          }
        }
      } catch {
        // Silently ignore classList errors on exotic nodes
      }
    };

    // When pointer leaves the window, push cursor offscreen and hide inner dot & reading line
    const handleLeaveWindow = () => {
      cursorX.set(-100);
      cursorY.set(-100);
      cursorSize.set(16);
      innerDotOpacity.set(0);
      if (readingLineRef.current) {
        readingLineRef.current.style.opacity = "0";
      }
      if (prevHoveredEl.current) {
        (prevHoveredEl.current as HTMLElement).classList.remove("jod-text-hover");
        prevHoveredEl.current = null;
      }
    };

    document.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeaveWindow);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeaveWindow);
      if (prevHoveredEl.current) {
        (prevHoveredEl.current as HTMLElement).classList.remove("jod-text-hover");
        prevHoveredEl.current = null;
      }
    };
  }, [cursorX, cursorY, cursorSize, innerDotOpacity]);

  // CSS variable to use as accent color. Consumers can set --cursor-accent in their theme.
  // Provide fallback to a readable blue (#1e90ff).
  const accentVar = "var(--cursor-accent, #1e90ff)";

  return (
    <>
      {children}

      {/* Reading guide bar - follows cursor, shown only when over text */}
      <div
        ref={readingLineRef}
        aria-hidden
        className="reading-line hidden md:block pointer-events-none"
        style={{
          position: "fixed",
          left: "-100px",
          top: "-100px",
          zIndex: 49,
          width: 160,
          height: 8,
          borderRadius: 9999,
          background: "rgba(30,157,241,0.08)",
          boxShadow: "0 6px 14px rgba(30,144,255,0.35)",
          transform: "translate(-50%, 0)",
          opacity: 0.5,
          transition: "opacity 120ms linear, left 80ms linear, top 80ms linear",
        }}
      />

      {/* Custom cursor element - only shows on non-touch devices and on md+ screens */}
      <motion.div
        ref={cursorRef}
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-50 hidden md:block cursor-smoothing"
        style={{
          x: springX, // framer motion will set translateX
          y: springY, // translateY
          width: springSize,
          height: springSize,
        }}
      >
        {/* Outer ring */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid",
            borderColor: accentVar,
            backgroundColor: "transparent",
            boxShadow: `0 2px 10px rgba(0,0,0,0.08)`,
            transition: "box-shadow 180ms ease, transform 120ms ease",
          }}
        >
          {/* Inner dot used when hovering text to provide subtle reading cue */}
          <motion.div
            style={{
              width: 6,
              height: 6,
              borderRadius: 9999,
              background: accentVar,
              opacity: springInnerOpacity,
              transformOrigin: "center",
              boxShadow: `0 6px 14px rgba(30,144,255,0.18)`,
            }}
          />
        </div>
      </motion.div>
    </>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface CustomCursorProps {
  children: React.ReactNode;
}

/**
 * CustomCursor component that creates an adaptive cursor following motion.dev patterns
 * Cursor size adapts based on hover target: small (text), medium (buttons), large (cards)
 * Respects prefers-reduced-motion for accessibility
 */
export function CustomCursor({ children }: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // Motion values for smooth cursor movement
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorSize = useMotionValue(16);
  
  // Spring configuration for smooth animations
  const springX = useSpring(cursorX, { stiffness: 300, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 300, damping: 28 });
  const springSize = useSpring(cursorSize, { stiffness: 400, damping: 40 });

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 8);
      cursorY.set(e.clientY - 8);
    };

    const handlePointerEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // Adaptive sizing based on element type and classes
      if (target.closest('button') || target.closest('a') || target.closest('[role="button"]')) {
        cursorSize.set(32); // Medium for buttons/links
      } else if (target.closest('.card') || target.closest('[data-card]')) {
        cursorSize.set(48); // Large for cards
      } else if (target.closest('h1, h2, h3, h4, h5, h6, p, span, div')) {
        cursorSize.set(12); // Small for text elements
      } else {
        cursorSize.set(16); // Default size
      }
    };

    const handlePointerLeave = () => {
      cursorSize.set(16); // Reset to default
    };

    // Event listeners
    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('pointerenter', handlePointerEnter, true);
    document.addEventListener('pointerleave', handlePointerLeave, true);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('pointerenter', handlePointerEnter, true);
      document.removeEventListener('pointerleave', handlePointerLeave, true);
    };
  }, [cursorX, cursorY, cursorSize]);

  return (
    <>
      {children}
      {/* Custom cursor element - only shows on non-touch devices */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference hidden md:block"
        style={{
          x: springX,
          y: springY,
          width: springSize,
          height: springSize,
        }}
      >
        <div 
          className="w-full h-full rounded-full border-2"
          style={{ 
            borderColor: 'rgb(30, 157, 241)', // Primary blue color
            backgroundColor: 'rgba(30, 157, 241, 0.1)'
          }}
        />
      </motion.div>
    </>
  );
}
"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Component that scrolls to top on route changes
 * Ensures consistent navigation behavior across the app
 */
export function ScrollToTopOnRouteChange() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change with smooth behavior if supported
    const supportsSmooth = 'scrollBehavior' in document.documentElement.style;
    
    if (supportsSmooth) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.search]);

  return null;
}
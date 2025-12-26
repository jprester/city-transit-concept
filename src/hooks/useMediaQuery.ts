import { useState, useEffect } from "react";

export type Breakpoint = "mobile" | "tablet" | "desktop";

// Breakpoints
const MOBILE_MAX = 767;
const TABLET_MAX = 1023;

export function useMediaQuery() {
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= MOBILE_MAX;
  const isTablet = windowWidth > MOBILE_MAX && windowWidth <= TABLET_MAX;
  const isDesktop = windowWidth > TABLET_MAX;

  const breakpoint: Breakpoint = isMobile
    ? "mobile"
    : isTablet
    ? "tablet"
    : "desktop";

  return {
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
    breakpoint,
  };
}

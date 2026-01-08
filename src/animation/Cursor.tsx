import { useEffect, useRef } from "react";
import "../styles/cursor.css";

const Cursor = (): JSX.Element | null => {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Mouse position
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  // Cursor positions
  const innerX = useRef(0);
  const innerY = useRef(0);
  const outerX = useRef(0);
  const outerY = useRef(0);

  // Track if tab is active
  const isTabActive = useRef(true);

  // Check if device is mobile
  const isMobile = typeof window !== 'undefined' &&
    (window.innerWidth < 1024 || 'ontouchstart' in window);

  useEffect(() => {
    if (isMobile) return;

    const inner = innerRef.current;
    const outer = outerRef.current;
    if (!inner || !outer) return;

    // Animation loop - only runs when tab is visible
    const animate = () => {
      if (!isTabActive.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      // Inner cursor - fast follow
      innerX.current += (mouseX.current - innerX.current) * 0.35;
      innerY.current += (mouseY.current - innerY.current) * 0.35;

      // Outer cursor - smooth trail
      outerX.current += (mouseX.current - outerX.current) * 0.12;
      outerY.current += (mouseY.current - outerY.current) * 0.12;

      inner.style.transform = `translate(${innerX.current}px, ${innerY.current}px) translate(-50%, -50%)`;
      outer.style.transform = `translate(${outerX.current}px, ${outerY.current}px) translate(-50%, -50%)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    // Mouse handlers
    const onMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      inner.style.opacity = "1";
      outer.style.opacity = "1";
    };

    const onMouseLeave = () => {
      inner.style.opacity = "0";
      outer.style.opacity = "0";
    };

    // Visibility change - pause when tab hidden
    const onVisibilityChange = () => {
      isTabActive.current = !document.hidden;
    };

    // Start animation
    rafRef.current = requestAnimationFrame(animate);

    // Event listeners
    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Hover effects - setup once, no MutationObserver
    const setupHoverEffects = () => {
      const interactiveSelector = "a, button, input, textarea, select, [role='button'], h1";

      document.querySelectorAll(interactiveSelector).forEach(el => {
        el.addEventListener("mouseenter", () => {
          inner.classList.add("cursor-hover");
          outer.classList.add("cursor-hover");
        });
        el.addEventListener("mouseleave", () => {
          inner.classList.remove("cursor-hover");
          outer.classList.remove("cursor-hover");
        });
      });

      document.querySelectorAll("[data-cursor='card']").forEach(el => {
        el.addEventListener("mouseenter", () => {
          inner.classList.add("cursor-on-card");
          outer.classList.add("cursor-on-card");
        });
        el.addEventListener("mouseleave", () => {
          inner.classList.remove("cursor-on-card");
          outer.classList.remove("cursor-on-card");
        });
      });
    };

    // Setup after a short delay to let page render
    setTimeout(setupHoverEffects, 500);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div ref={innerRef} className="cursor-inner" style={{ opacity: 0 }} />
      <div ref={outerRef} className="cursor-outer" style={{ opacity: 0 }} />
    </>
  );
};

export default Cursor;

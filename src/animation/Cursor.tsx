import { useEffect, useRef } from "react";
import "../styles/cursor.css";
import { useLocation } from "react-router-dom";

const Cursor = (): JSX.Element | null => {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const location = useLocation();

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

  // Reset cursor on route change
  useEffect(() => {
    const inner = innerRef.current;
    const outer = outerRef.current;
    if (inner && outer) {
      inner.classList.remove("cursor-on-card", "cursor-hidden");
      outer.classList.remove("cursor-on-card", "cursor-hidden");
    }
  }, [location]);

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

    // Event Delegation for Hover Effects
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Check for no-cursor zone (like icon containers)
      const noCursor = target.closest("[data-cursor='none']");

      // Check for Card
      const card = target.closest("[data-cursor='card']");

      // Check for Category
      const category = target.closest("[data-cursor='category']");

      // Check for Interactive Elements (which should HIDE custom cursor)
      const interactiveSelector = "a, button, input, textarea, select, [role='button'], label";
      const interactive = target.closest(interactiveSelector);

      // Special handling: The Card View Link is technically interactive (it's an <a>), 
      // but we WANT the custom cursor there (Card View Mode).
      const isCardViewLink = target.closest(".card-view-link");

      // Remove all cursor states first
      const removeAllStates = () => {
        inner.classList.remove("cursor-on-card", "cursor-on-category", "cursor-hidden");
        outer.classList.remove("cursor-on-card", "cursor-on-category", "cursor-hidden");
      };

      if (noCursor) {
        // If hovering on a no-cursor zone (icon), hide custom cursor
        removeAllStates();
        inner.classList.add("cursor-hidden");
        outer.classList.add("cursor-hidden");
      } else if (category) {
        // If hovering on a tech category card (not on icon)
        removeAllStates();
        inner.classList.add("cursor-on-category");
        outer.classList.add("cursor-on-category");
      } else if (card && isCardViewLink) {
        // If we are on the card view link, SHOW View Cursor
        removeAllStates();
        inner.classList.add("cursor-on-card");
        outer.classList.add("cursor-on-card");
      } else if (interactive) {
        // If interactive (and NOT the card view link), HIDE custom cursor
        removeAllStates();
        inner.classList.add("cursor-hidden");
        outer.classList.add("cursor-hidden");
      } else if (card) {
        // Inside card, but not on an interactive element
        removeAllStates();
        inner.classList.add("cursor-on-card");
        outer.classList.add("cursor-on-card");
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement;

      if (!related) return;

      const goingToCard = related.closest("[data-cursor='card']");
      const goingToCategory = related.closest("[data-cursor='category']");
      const interactiveSelector = "a, button, input, textarea, select, [role='button'], label";
      const goingToInteractive = related.closest(interactiveSelector);

      if (!goingToCard) {
        inner.classList.remove("cursor-on-card");
        outer.classList.remove("cursor-on-card");
      }

      if (!goingToCategory) {
        inner.classList.remove("cursor-on-category");
        outer.classList.remove("cursor-on-category");
      }

      if (!goingToInteractive) {
        inner.classList.remove("cursor-hidden");
        outer.classList.remove("cursor-hidden");
      }
    };

    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [isMobile, location]); // Re-bind if necessary, though mainly location effect handles reset

  if (isMobile) return null;

  return (
    <>
      <div ref={innerRef} className="cursor-inner" style={{ opacity: 0 }} />
      <div ref={outerRef} className="cursor-outer" style={{ opacity: 0 }} />
    </>
  );
};

export default Cursor;

import { useEffect, useRef, useCallback } from "react";
import "../styles/cursor.css";

const Cursor = (): JSX.Element | null => {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  // Store positions as refs for better performance (no re-renders)
  const mousePos = useRef({ x: 0, y: 0 });
  const innerPos = useRef({ x: 0, y: 0 });
  const outerPos = useRef({ x: 0, y: 0 });
  const isVisible = useRef(false);
  const isHovering = useRef(false);
  const isOnCard = useRef(false);
  const isClicking = useRef(false);

  // Check if device is mobile/tablet
  const isMobile = typeof window !== 'undefined' &&
    (window.innerWidth < 1024 || 'ontouchstart' in window);

  // Animation loop using requestAnimationFrame
  const animate = useCallback(() => {
    if (!innerRef.current || !outerRef.current) {
      requestRef.current = requestAnimationFrame(animate);
      return;
    }

    // Lerp factors - higher = faster following
    const innerLerp = 0.25;
    const outerLerp = 0.12;

    // Calculate new positions with lerp
    innerPos.current.x += (mousePos.current.x - innerPos.current.x) * innerLerp;
    innerPos.current.y += (mousePos.current.y - innerPos.current.y) * innerLerp;

    outerPos.current.x += (mousePos.current.x - outerPos.current.x) * outerLerp;
    outerPos.current.y += (mousePos.current.y - outerPos.current.y) * outerLerp;

    // Apply transforms directly to DOM (no React state = no re-renders)
    innerRef.current.style.transform = `translate3d(${innerPos.current.x}px, ${innerPos.current.y}px, 0) translate(-50%, -50%)`;
    outerRef.current.style.transform = `translate3d(${outerPos.current.x}px, ${outerPos.current.y}px, 0) translate(-50%, -50%)`;

    requestRef.current = requestAnimationFrame(animate);
  }, []);

  // Mouse move handler - just update the target position
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePos.current.x = e.clientX;
    mousePos.current.y = e.clientY;

    if (!isVisible.current && innerRef.current && outerRef.current) {
      isVisible.current = true;
      innerRef.current.classList.remove('cursor-hidden');
      outerRef.current.classList.remove('cursor-hidden');
    }
  }, []);

  // Mouse enter/leave handlers
  const handleMouseLeave = useCallback(() => {
    if (innerRef.current && outerRef.current) {
      isVisible.current = false;
      innerRef.current.classList.add('cursor-hidden');
      outerRef.current.classList.add('cursor-hidden');
    }
  }, []);

  // Click handlers
  const handleMouseDown = useCallback(() => {
    isClicking.current = true;
    innerRef.current?.classList.add('cursor-clicking');
    outerRef.current?.classList.add('cursor-clicking');
  }, []);

  const handleMouseUp = useCallback(() => {
    isClicking.current = false;
    innerRef.current?.classList.remove('cursor-clicking');
    outerRef.current?.classList.remove('cursor-clicking');
  }, []);

  // Start animation loop
  useEffect(() => {
    if (isMobile) return;

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate, isMobile]);

  // Setup global event listeners
  useEffect(() => {
    if (isMobile) return;

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMobile, handleMouseMove, handleMouseLeave, handleMouseDown, handleMouseUp]);

  // Setup hover detection for interactive elements and cards
  useEffect(() => {
    if (isMobile) return;

    const handleInteractiveEnter = () => {
      isHovering.current = true;
      innerRef.current?.classList.add('cursor-hover');
      outerRef.current?.classList.add('cursor-hover');
    };

    const handleInteractiveLeave = () => {
      isHovering.current = false;
      innerRef.current?.classList.remove('cursor-hover');
      outerRef.current?.classList.remove('cursor-hover');
    };

    const handleCardEnter = () => {
      isOnCard.current = true;
      innerRef.current?.classList.add('cursor-on-card');
      outerRef.current?.classList.add('cursor-on-card');
    };

    const handleCardLeave = () => {
      isOnCard.current = false;
      innerRef.current?.classList.remove('cursor-on-card');
      outerRef.current?.classList.remove('cursor-on-card');
    };

    // Function to setup listeners on elements
    const setupListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, input, textarea, select, [role="button"], .link, h1'
      );

      const cardElements = document.querySelectorAll('[data-cursor="card"]');

      interactiveElements.forEach(el => {
        el.addEventListener("mouseenter", handleInteractiveEnter);
        el.addEventListener("mouseleave", handleInteractiveLeave);
      });

      cardElements.forEach(el => {
        el.addEventListener("mouseenter", handleCardEnter);
        el.addEventListener("mouseleave", handleCardLeave);
      });
    };

    // Initial setup
    setupListeners();

    // Use MutationObserver for dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            // Check for cards
            if (node.matches?.('[data-cursor="card"]')) {
              node.addEventListener("mouseenter", handleCardEnter);
              node.addEventListener("mouseleave", handleCardLeave);
            }
            // Check for interactive elements
            if (node.matches?.('a, button, input, textarea, select, [role="button"], .link, h1')) {
              node.addEventListener("mouseenter", handleInteractiveEnter);
              node.addEventListener("mouseleave", handleInteractiveLeave);
            }
            // Check children
            node.querySelectorAll?.('[data-cursor="card"]').forEach(el => {
              el.addEventListener("mouseenter", handleCardEnter);
              el.addEventListener("mouseleave", handleCardLeave);
            });
            node.querySelectorAll?.('a, button, input, textarea, select, [role="button"], .link, h1').forEach(el => {
              el.addEventListener("mouseenter", handleInteractiveEnter);
              el.addEventListener("mouseleave", handleInteractiveLeave);
            });
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [isMobile]);

  // Don't render on mobile
  if (isMobile) return null;

  return (
    <>
      {/* Inner cursor - follows mouse closely */}
      <div
        ref={innerRef}
        className="cursor-inner cursor-hidden"
      />

      {/* Outer cursor - trails behind */}
      <div
        ref={outerRef}
        className="cursor-outer cursor-hidden"
      />
    </>
  );
};

export default Cursor;

import { useEffect, useRef, useState, useCallback } from "react";
import "../styles/cursor.css";

interface CursorPosition {
  x: number;
  y: number;
}

interface CursorState {
  isHovering: boolean;
  isOnCard: boolean;
  isClicking: boolean;
}

const Cursor = (): JSX.Element | null => {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const [cursorPos, setCursorPos] = useState<CursorPosition>({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState<CursorPosition>({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState<CursorState>({
    isHovering: false,
    isOnCard: false,
    isClicking: false,
  });
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 1024 || "ontouchstart" in window);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent): void => {
    setTargetPos({ x: e.clientX, y: e.clientY });
    if (!isVisible) setIsVisible(true);
  }, [isVisible]);

  // Mouse enter/leave handlers
  const handleMouseEnter = useCallback((): void => {
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback((): void => {
    setIsVisible(false);
  }, []);

  // Click handlers
  const handleMouseDown = useCallback((): void => {
    setCursorState(prev => ({ ...prev, isClicking: true }));
  }, []);

  const handleMouseUp = useCallback((): void => {
    setCursorState(prev => ({ ...prev, isClicking: false }));
  }, []);

  // Smooth animation using requestAnimationFrame
  const animate = useCallback((time: number): void => {
    if (previousTimeRef.current !== undefined) {
      // Lerp factor for smooth trailing (lower = smoother, higher = faster)
      const innerLerp = 0.35;
      const outerLerp = 0.15;

      setCursorPos(prev => ({
        x: prev.x + (targetPos.x - prev.x) * innerLerp,
        y: prev.y + (targetPos.y - prev.y) * innerLerp,
      }));

      // Apply positions to DOM elements directly for better performance
      if (innerRef.current) {
        const innerX = cursorPos.x + (targetPos.x - cursorPos.x) * innerLerp;
        const innerY = cursorPos.y + (targetPos.y - cursorPos.y) * innerLerp;
        innerRef.current.style.transform = `translate3d(${innerX}px, ${innerY}px, 0) translate(-50%, -50%)`;
      }

      if (outerRef.current) {
        const outerX = cursorPos.x + (targetPos.x - cursorPos.x) * outerLerp;
        const outerY = cursorPos.y + (targetPos.y - cursorPos.y) * outerLerp;
        outerRef.current.style.transform = `translate3d(${outerX}px, ${outerY}px, 0) translate(-50%, -50%)`;
      }
    }

    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [targetPos, cursorPos]);

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

  // Setup event listeners
  useEffect(() => {
    if (isMobile) return;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMobile, handleMouseMove, handleMouseEnter, handleMouseLeave, handleMouseDown, handleMouseUp]);

  // Setup hover detection for interactive elements and cards
  useEffect(() => {
    if (isMobile) return;

    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, [role="button"], .link, h1'
    );

    const cardElements = document.querySelectorAll(
      '[class*="card"], [class*="Card"], .tilt, [data-cursor="card"]'
    );

    const handleInteractiveEnter = (): void => {
      setCursorState(prev => ({ ...prev, isHovering: true }));
    };

    const handleInteractiveLeave = (): void => {
      setCursorState(prev => ({ ...prev, isHovering: false }));
    };

    const handleCardEnter = (): void => {
      setCursorState(prev => ({ ...prev, isOnCard: true }));
    };

    const handleCardLeave = (): void => {
      setCursorState(prev => ({ ...prev, isOnCard: false }));
    };

    interactiveElements.forEach(el => {
      el.addEventListener("mouseenter", handleInteractiveEnter);
      el.addEventListener("mouseleave", handleInteractiveLeave);
    });

    cardElements.forEach(el => {
      el.addEventListener("mouseenter", handleCardEnter);
      el.addEventListener("mouseleave", handleCardLeave);
    });

    // Use MutationObserver to handle dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            // Check for cards
            if (node.matches('[class*="card"], [class*="Card"], .tilt, [data-cursor="card"]')) {
              node.addEventListener("mouseenter", handleCardEnter);
              node.addEventListener("mouseleave", handleCardLeave);
            }
            // Check for interactive elements
            if (node.matches('a, button, input, textarea, select, [role="button"], .link, h1')) {
              node.addEventListener("mouseenter", handleInteractiveEnter);
              node.addEventListener("mouseleave", handleInteractiveLeave);
            }
            // Check children
            node.querySelectorAll('[class*="card"], [class*="Card"], .tilt, [data-cursor="card"]').forEach(el => {
              el.addEventListener("mouseenter", handleCardEnter);
              el.addEventListener("mouseleave", handleCardLeave);
            });
            node.querySelectorAll('a, button, input, textarea, select, [role="button"], .link, h1').forEach(el => {
              el.addEventListener("mouseenter", handleInteractiveEnter);
              el.addEventListener("mouseleave", handleInteractiveLeave);
            });
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      interactiveElements.forEach(el => {
        el.removeEventListener("mouseenter", handleInteractiveEnter);
        el.removeEventListener("mouseleave", handleInteractiveLeave);
      });
      cardElements.forEach(el => {
        el.removeEventListener("mouseenter", handleCardEnter);
        el.removeEventListener("mouseleave", handleCardLeave);
      });
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
        className={`cursor-inner ${!isVisible ? "cursor-hidden" : ""} ${cursorState.isHovering ? "cursor-hover" : ""
          } ${cursorState.isOnCard ? "cursor-on-card" : ""} ${cursorState.isClicking ? "cursor-clicking" : ""
          }`}
      />

      {/* Outer cursor - trails behind */}
      <div
        ref={outerRef}
        className={`cursor-outer ${!isVisible ? "cursor-hidden" : ""} ${cursorState.isHovering ? "cursor-hover" : ""
          } ${cursorState.isOnCard ? "cursor-on-card" : ""} ${cursorState.isClicking ? "cursor-clicking" : ""
          }`}
      />
    </>
  );
};

export default Cursor;

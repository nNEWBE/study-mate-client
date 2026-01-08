import { useState, useEffect, useRef, useCallback } from "react";

interface TextScrambleProps {
  children: string;
}

const TextScramble = ({ children: text }: TextScrambleProps): JSX.Element => {
  const [scrambled, setScrambled] = useState<string>("");
  const textRef = useRef<HTMLHeadingElement>(null);
  const hasAnimated = useRef(false);

  const getRandomChar = (): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };

  const startScramble = useCallback((): void => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    let iteration = 0;
    const maxIterations = 6; // Reduced from 10

    const animate = () => {
      const newText = text
        .split("")
        .map((char, index) => {
          if (index < iteration) return text[index];
          return getRandomChar();
        })
        .join("");

      setScrambled(newText);

      if (iteration < text.length) {
        iteration += 1;
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [text]);

  useEffect(() => {
    const currentRef = textRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startScramble();
          }
        });
      },
      { threshold: 0.5 },
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [startScramble]);

  return (
    <h1
      ref={textRef}
      className="font-dosis text-4xl mb-7 sm:text-5xl font-bold text-secondary text-center dark:text-white"
    >
      {scrambled || text}
      <span className="text-5xl text-primary">.</span>
    </h1>
  );
};

export default TextScramble;

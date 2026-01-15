import { useState, useEffect, useRef, useCallback } from "react";

interface TextScrambleProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

const TextScramble = ({
  children: text,
  as: Tag = "h1",
  className = ""
}: TextScrambleProps): JSX.Element => {
  const [scrambled, setScrambled] = useState<{ char: string; isScrambled: boolean }[] | null>(null);
  const textRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  const getRandomChar = (): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };

  const startScramble = useCallback((): void => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    let iteration = 0;

    const animate = () => {
      const currentOutput = text.split("").map((char, index) => {
        if (index < iteration) {
          return { char: text[index], isScrambled: false };
        }
        return { char: getRandomChar(), isScrambled: true };
      });

      setScrambled(currentOutput);

      if (iteration < text.length) {
        iteration += 0.5;
        requestAnimationFrame(animate);
      } else {
        setScrambled(text.split("").map(c => ({ char: c, isScrambled: false })));
      }
    };

    requestAnimationFrame(animate);
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

  const defaultClasses = "font-dosis text-4xl mb-7 sm:text-5xl font-bold text-secondary text-center dark:text-white";
  const finalClass = className ? `${defaultClasses} ${className}` : defaultClasses;

  return (
    <Tag
      ref={textRef}
      className={finalClass}
    >
      {scrambled ? (
        scrambled.map((item, index) => (
          <span
            key={index}
            className={item.isScrambled ? "opacity-60 transition-all duration-200 transform-gpu" : ""}
          >
            {item.char}
          </span>
        ))
      ) : (
        text
      )}
      <span className="text-5xl text-primary">.</span>
    </Tag>
  );
};

export default TextScramble;

import { useState, useEffect, useRef, useCallback, MutableRefObject } from "react";

interface TextScrambleProps {
  children: string;
}

const TextScramble = ({ children: text }: TextScrambleProps): JSX.Element => {
  const [scrambled, setScrambled] = useState<string>("");
  const textRef = useRef<HTMLHeadingElement>(null);
  const scrambleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getRandomChar = (): string => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;':,./<>?";
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };

  const startScramble = useCallback((): void => {
    const scramble = (iterations: number): void => {
      scrambleTimeout.current = setTimeout(() => {
        const newText = text
          ?.split("")
          ?.map((char) => {
            if (Math.random() < iterations / 10) {
              return char;
            }
            return getRandomChar();
          })
          .join("");

        setScrambled(newText);

        if (iterations > 0) {
          scramble(iterations - 1);
        } else {
          setScrambled(text);
        }
      }, 35);
    };

    scramble(10);
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
      if (scrambleTimeout.current) {
        clearTimeout(scrambleTimeout.current);
      }
    };
  }, [startScramble]);

  return (
    <h1
      ref={textRef}
      className="font-dosis text-4xl mb-7 sm:text-5xl font-bold text-secondary text-center dark:text-white"
    >
      {scrambled ? scrambled : text}
      <span className="text-5xl text-primary">.</span>
    </h1>
  );
};

export default TextScramble;
